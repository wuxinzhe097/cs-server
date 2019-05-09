var express = require('express');
var router = express.Router();
let Talk = require('../models/talks');

// 创建梦话接口
router.post("/talkCreate", function (req, res, next) {
    let userId = req.cookies.userId,
        talkTitle = req.body.talkTitle,
        talkInfo = req.body.talkInfo;
    let User = require('../models/users');
    User.findOne({
        "userId": userId
    }, function (Usererr, Userdoc) {
        if (Usererr) {
            res.json({
                status: '1',
                msg: err.message,
                result: ""
            })
        } else {
            let userId = Userdoc.userId;
            let userName = Userdoc.userName;
            let userImg = Userdoc.userImg;
            let r1 = Math.floor(Math.random() * 10);
            let r2 = Math.floor(Math.random() * 10);
            let month = (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
            let date = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
            let hour = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
            let min = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
            let sec = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
            let talkId = "DT" + new Date().getFullYear() + "" + month + date + hour + min + sec + r1 + r2;
            let createTime = new Date().getFullYear() + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
            Talk.create([
                {
                    talkId:talkId,
                    userId:userId,
                    userName:userName,
                    userImg:userImg,
                    createTime:createTime,
                    talkTitle:talkTitle,
                    talkInfo:talkInfo,
                    comment:[]
                }
            ],function(err,doc){
                if(err){
                    res.json({
                        status: '1',
                        msg: err.message,
                        result: ""
                    })  
                }else{
                    res.json({
                        status:'0',
                        msg:'',
                        result:"创建成功"
                    })
                }
            })

        }
    })
})
// 查询梦话列表接口
router.get('/',function(req,res,next){
    Talk.find({},function(err,doc){
        if(err) {
            res.json({
               status:'1',
               msg:err.message,
               result:""
            })
        }else{
            res.json({
               status:'0',
               msg:'',
               result:{
                   count:doc.length,
                   list:doc
               } 
            })
        }
    }).sort({_id:-1})
 })
// 查询梦话详情接口
router.post("/talkFind", function (req, res, next) {
    let talkId = req.body.talkId;
    Talk.findOne({
      talkId: talkId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
            status: '0',
            msg: '',
            result: doc
          })
      }
    })
  }) 
// 查询个人的梦话  
router.post("/myTalk", function (req, res, next) {
    let  userId = req.cookies.userId;
    Talk.find({
      userId: userId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
            status: '0',
            msg: '',
            result: doc
          })
      }
    }).sort({_id:-1})
  }) 
  // 创建评论接口
router.post("/commentCreate", function (req, res, next) {
  let userId = req.cookies.userId,
      talkId = req.body.talkId;
      commentInfo = req.body.commentInfo;
  let User = require('../models/users');
  User.findOne({
      "userId": userId
  }, function (Usererr, Userdoc) {
      if (Usererr) {
          res.json({
              status: '1',
              msg: err.message,
              result: ""
          })
      } else {
          let userId = Userdoc.userId;
          let userName = Userdoc.userName;
          let userImg = Userdoc.userImg;
          let r1 = Math.floor(Math.random() * 10);
          let r2 = Math.floor(Math.random() * 10);
          let month = (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
          let date = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
          let hour = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
          let min = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
          let sec = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
          let commentId = "CM" + new Date().getFullYear() + "" + month + date + hour + min + sec + r1 + r2;
          let createTime = new Date().getFullYear() + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
          let commentDoc={
                  commentId:commentId,
                  userId:userId,
                  userName:userName,
                  userImg:userImg,
                  createTime:createTime,
                  commentInfo:commentInfo,
              }
          Talk.findOne({
            "talkId": talkId
        },function(talkerr,talkdoc){
          if(talkerr){
            res.json({
              status: '1',
              msg: err.message,
              result: ""
          })
          }else{
            talkdoc.comment.push(commentDoc);
            talkdoc.save(function(err,doc){
              if(err){
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ""
              })
              }else{
                res.json({
                  status: '0',
                  msg: '',
                  result: "评论成功"
                })
              }
            })
          }
        })

      }
  })
})
// 删除梦话接口
router.post("/talkDel",function(req,res,next){
  let userId = req.cookies.userId,
      talkId = req.body.talkId;
   Talk.findOne({
     talkId:talkId,
     userId:userId
   },function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ""
    })
    }else{
      if(doc){
     Talk.remove({
      talkId:talkId,
     },function(err1,doc1){
      if(err1){
        res.json({
          status: '1',
          msg: err.message,
          result: ""
      })
      }else{
        res.json({
          status: '0',
          msg: '',
          result: "删除成功"
        })
      }
     })   
      }else{
        res.json({
          status: '2',
          msg: '',
          result: "未找到相应的id"
        })
      }
    }
   })   
})
module.exports=router;