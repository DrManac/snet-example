const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function generateAccessToken(email) {
    return jwt.sign({email}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const config = {
    "port": 3600,
    "appEndpoint": "http://localhost:3600",
    "apiEndpoint": "http://localhost:3600",
};

mongoose.connect('mongodb+srv://dbUser:AUoCq0hU7LRv0BUW@cluster0.qkus8.mongodb.net/test?authSource=admin&replicaSet=atlas-lo5j12-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true', {useNewUrlParser: true, useUnifiedTopology: true});

const User = mongoose.model('User', 
    {
        name: String,
        email: String,
        pass: String,
        friends: [{type : ObjectId, ref: 'User' }]
    });

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
    
app.use(bodyParser.json());

async function getUser(req, res) {
    console.log(`get user ${req.params.userId}`);
    if(req.params.userId == 'me')
        req.params.userId = req.user.email
    let user = await User.aggregate([
        {'$match': {'email': req.params.userId}}, 
        {'$unwind': {'path': '$friends', 'preserveNullAndEmptyArrays': true}}, 
        {'$lookup': {'from': 'users', 'localField': 'friends', 'foreignField': '_id', 'as': 'friends'}}, 
        {'$unwind': {'path': '$friends', 'preserveNullAndEmptyArrays': true}}, 
        {'$group': {'_id': '$_id', 'obj': {'$first': '$$ROOT'}, 'friends': {'$push': '$friends'}}}, 
        {'$replaceRoot': {'newRoot': {'$mergeObjects': ['$obj', {'friends': '$friends'}]}}}
      ])
    user = user[0]
    if (!user)
        res.status(404).send({code: 404, message: 'User not found'})
    else
        res.status(200).send(user);
}

async function deleteFriend(req, res) {
    console.log(`delete friend ${req.params.friendId} of user ${req.params.userId}`);
    await User.updateOne({'email': req.params.userId}, {'$pull': {'friends': req.params.friendId}})
    res.status(200).send();
}

async function addFriend(req, res) {
    try {
        let friendId = req.body.id
        console.log(`add friend ${friendId} to user ${req.params.userId}`);
        await User.updateOne({'email': req.params.userId}, {'$push': {'friends': friendId}})
        res.status(200).send();
    } catch (e){
        res.status(500).send()
    }
}

async function find(req, res) {
    console.log(`find user ${req.query.query}`);
    if(!req.query.query){
        res.status(200).send([]);
        return
    }
    //let users = [{name: 'mock user'}]
    let users = await User.find({name: {'$regex': req.query.query}})
    res.status(200).send(users);
}

async function signIn(req, res) {
    console.log(`signIn`);
    var user = await User.find({'email': req.body.email, 'pass': req.body.pass})
    console.log(user)
    if(user.length == 1) {
        const token = generateAccessToken(user[0].email);
        res.status(200).send(JSON.stringify(token));
    }
    else
        res.status(401).send()
}

async function signUp(req, res) {
    console.log(`signUp`);
    var user
    try {
        user = await User.create(req.body)
    } catch {
        res.status(422).send()
        return
    }
    console.log(user)
    if(user) {
        const token = generateAccessToken(user.email);
        res.status(200).send(JSON.stringify(token));
    }
    else
        res.status(401).send()
}

app.get('/users/:userId', [authenticateToken, getUser]);
app.get('/users/', [authenticateToken, find]);
app.delete('/users/:userId/friends/:friendId', [authenticateToken, deleteFriend])
app.post('/users/:userId/friends', [authenticateToken, addFriend])
app.post('/signIn', [signIn])
app.post('/signUp', [signUp])
    
app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
