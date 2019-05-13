const express = require('express');
const app = express();
const parser = require('body-parser');
require('./lib/connectdb')
const userRouter = require('./controllers/user.router');
// lấy data lên bằng json cho tất cả cá router
app.use(parser.json({type: 'application/json'}));

app.use('/user',userRouter);

app.listen(3000,()=>{
    console.log('Server Start!');
})