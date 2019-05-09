let express = require('express');
let router = express.Router();
let mongoose=require('mongoose');
// 连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true})

mongoose.connection.on('connected',function(){
    console.log("数据库连接成功！")
})
mongoose.connection.on('error',function(){
    console.log("数据库连接失败！")
})
mongoose.connection.on('disconnected',function(){
    console.log("数据库断开连接！")
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
