const { ObjectId } = require('bson');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbUser:AUoCq0hU7LRv0BUW@cluster0.qkus8.mongodb.net/test?authSource=admin&replicaSet=atlas-lo5j12-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true', {useNewUrlParser: true, useUnifiedTopology: true});

const User = mongoose.model('User', 
    {
        name: String,
        email: String,
        pass: String,
        friends: [{type : ObjectId, ref: 'User' }]
    });

app.get()

async function main() {
    await User.deleteMany()
    let friends = [];
    for(let i = 1; i <= 10; i++ ) {
        let user = new User({name: `Test User ${i}`, email: `test${i}@test`, pass: '12345', friends: friends})
        await user.save();
        console.log(user.id);
        friends.push(user.id);
    }
    console.log('done');
}

main();
