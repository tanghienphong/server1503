const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    name: String,
    posts: [
        {type: Schema.Types.ObjectId, ref: 'post'}
    ],
    friends: [
        {type: Schema.Types.ObjectId, ref:'user'}
    ],
    receiveRequests: [
        {type: Schema.Types.ObjectId, ref:'user'}
    ],
    sendRequests: [
        {type: Schema.Types.ObjectId, ref:'user'}
    ]
})

const UserModel = mongoose.model('user', UserSchema);

//Class User 
const {hash, compare} = require('../lib/bcrypt');
const {sign} = require('jsonwebtoken')
class User {
    static signUp(email, name, password){
        return new Promise((resolve, reject)=>{
            hash(password)
            .then(passwordHash=>{
                return UserModel.create({email, name, password:passwordHash})                    
            })
            .then(user => {
                delete user.password
                return resolve(user)
            })
            .catch(err=>reject(err))            
        })
        
    }

    static signIn(email, password){
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email})
            .then(user=>{
                if(!user) return reject(new Error('Can not find user!'))
                return compare(password, user.password) //(password nhap vao, password lay tu db ra(đã mã hóa))
                .then(result=>{
                    if(!result) return reject(new Error('Password invalid!'))
                    return sign({_id: user._id})
                    .then(token=>{
                        return resolve({
                            user: {
                                _id: user._id,
                                email: user.email,
                                name: user.name
                            },
                            token
                        })
                    })
                })
                .catch(err => {
                    return reject(new Error(err.message))
                })
            })            
            .catch(err => {
                return reject(new Error(err.message))
            })
        })        
    }

    static async login (email, password){
        const user = await UserModel.findOne({email})
        if(!user) return new Error('Can not find user!');
        const check = await compare(password, user.password)
        if(!check) return new Error('Password invalid!')
        // sign token
        const token = await sign({_id: user._id})
        if(!token)
            return new Error('Wrong!')
        return {
            user: {
                _id: user._id,
                                email: user.email,
                                name: user.name
            },
            token
        };
    }

    static async addFriend(idSender, idReceiver){
        const sender = await UserModel.findOneAndUpdate(
            {_id: idSender},
            {$addToSet:{sendRequests: idReceiver}},
            {new: true})
            if(!sender) throw new Error('Can not Update sender')
            const receiver = await UserModel.findOneAndUpdate(
                {_id: idReceiver},
                {$addToSet: {receiveRequests: idSender}},
                {new: true}
            )
            if(!receiver) throw new Error('Can not Update receiver!')
            return { 
                sender: {
                    _id: sender._id,
                    name: sender.name,
                    email: sender.email,
                    sendRequests: sender.sendRequests
                },
                receiver: {
                    _id: receiver._id,
                    name: receiver.name,
                    email: receiver.email,
                    receiveRequests: receiver.receiveRequests
                }
             }
    }
}
module.exports = {UserModel, User}
