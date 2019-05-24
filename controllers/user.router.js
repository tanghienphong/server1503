const express = require('express')
const router = express.Router();
const {User} = require('../models/User')
const { authenticate } = require('../lib/authenticate');

//signup
router.post('/signup', (req,res)=>{
    const{email, name, password} = req.body
    User.signUp(email, name, password)
    .then(user=>res.send(user))
    .catch(err=>res.send(err.message))
})
// signin
router.post('/signin',(req,res)=>{
    const { email, password } = req.body;
    User.login(email, password)
    .then(user=>{
        return res.send({
            success: true,
            data: user,
            message: ''
        })
    })
    .catch(err=>{
        return res.send({
            success: false,
            data: null,
            message: err.message
        })
    })
})

//add friend
router.post('/add-friend',authenticate,(req,res)=>{
    // const { token } = req.headers;
    const { idReceiver } = req.body;
    const idSender = req.userId;
    User.addFriend(isSender, idReceiver)
    .then(result=>res.send({
        success: true,
        data: result,
        message:''
    }))
    .catch(err => res.send({
        success:false,
        data: null,
        message: err.message
    }))
})
//accept friend
router.post('/accept-friend',authenticate,(req,res)=>{
    const { idReceiver } = req.body;
    const idSender = req.userId
    User.acceptFriend(idSender, idReceiver)
    .then(result => res.send({
        success: true,
        data: result,
        message: ''
    }))
    .catch(err=>res.send({
        success: false,
        data: null,
        message: err.message
    }))
})
//remove friend


module.exports = router