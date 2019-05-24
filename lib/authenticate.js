const {verify} = require('./jwt')
function authenticate(req,res,next){
    const { token } = req.headers
    verify(token)
    .then(decoded =>{
        req.userId = decoded._id
        return sign({_id: decoded._id})
    })
    .then(newToken=>{
        // return blacklist(token)
        // .then(()=>{
        //     req.token = newToken
        //     next();
        // })
        // req.token = newToken
            next();
    })
    .catch(err=> {
        console.log(err.message);
        throw new Error(err.message)
    })
}

module.exports = { authenticate }