const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = {
    "port": 3600,
    "appEndpoint": "http://localhost:3600",
    "apiEndpoint": "http://localhost:3600",
    // "jwt_secret": "myS33!!creeeT",
    // "jwt_expiration_in_seconds": 36000,
    // "environment": "dev",
    // "permissionLevels": {
    //     "NORMAL_USER": 1,
    //     "PAID_USER": 4,
    //     "ADMIN": 2048
    // }
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
    //let user = await User.findOne({email: req.params.userId});
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

app.get('/users/:userId', [getUser]);
app.delete('/users/:userId/friends/:friendId', [deleteFriend])

    
app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
