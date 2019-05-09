var express = require('express');
var router = express.Router();
let User = require('../models/users');


// 登录接口
router.post("/login", function (req, res, next) {
  let param = {
    userId: req.body.userId,
    userPwd: req.body.userPwd,
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.json({
          status: "0",
          msg: "",
          result: {
            userId: doc.userId
          }
        })
      } else {
        res.json({
          status: "2",
          msg: ""
        })
      }
    }
  })
});
// 注册接口
router.post("/register", function (req, res, next) {
  let userId = req.body.registerId,
    userPwd = req.body.registerPwd;
  User.findOne({
    'userId': userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: "2",
          msg: "",
          result: "用户名已注册"
        })
      } else {
        res.cookie("userId", userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.json({
          status: "0",
          msg: "",
          result: "注册成功"
        })
        User.create([{
          userId: userId,
          userName: userId,
          userPwd: userPwd,
          userImg: "head.jpg",
          cart: [],
          orderList: [],
          sleepList: [],
          dreamTalk: [],
          addressList: []
        }], function (err) {
          if (!err) {
            console.log('注册成功')
          } else {
            console.log('数据插入失败')
          }
        })
      }
    }
  })
})
// 登出接口
router.post("/logout", function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: "0",
    msg: "",
    result: ""
  })
});
// 查询用户信息
router.get("/userInfo", function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: '',
          result: doc
        });
      } else {
        res.json({
          status: "2",
          msg: '',
          result: "没有登录"
        });
      }
    }
  })
});
// 修改用户头像接口
router.post("/userHeadImgEdit", function (req, res, next) {
  let userId = req.cookies.userId,
    newImg = req.body.userImg;
  User.update({
      'userId': userId,
    }, {
      'userImg':newImg
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    })
})
// 修改用户昵称接口
router.post("/userNameEdit", function (req, res, next) {
  let userId = req.cookies.userId,
    userName = req.body.userName;
  User.update({
      'userId': userId,
    }, {
      'userName':userName
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    })
})
// 修改用户签名接口
router.post("/userSignEdit", function (req, res, next) {
  let userId = req.cookies.userId,
    userSign = req.body.userSign;
  User.update({
      'userId': userId,
    }, {
      'userSign':userSign
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    })
})
// 修改用户密码
router.post("/userPWEdit", function (req, res, next) {
  let userId = req.cookies.userId,
      oldPW = req.body.oldPW,
      newPW = req.body.newPW;
  User.findOne({
      'userId': userId,
      'userPwd':oldPW
    }, 
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        if(doc){
         User.updateOne({
          'userId': userId,
         },{
          'userPwd':newPW
         },function(err1, doc1){
          if (err1) {
            res.json({
              status: "1",
              msg: err.message,
              result: ''
            });
          }else{
            res.json({
              status: "0",
              msg: '',
              result: 'success'
            })
          }
         })
        }else{
          res.json({
            status: "2",
            msg: '旧密码错误',
            result: 'erro'
          })
        }
      }
    })
})
// 每日签到接口
router.post("/dailyAttendance", function (req, res, next) {
  let userId = req.cookies.userId,
    date = req.body.date;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        let dateItem = "";
        doc.dailyAttendance.forEach(item => {
          if (item.date == date) {
            dateItem = item.date;
          }
        });
        if (dateItem) {
          doc.save(function (err1, doc1) {
            if (err1) {
              res.json({
                status: "1",
                msg: err.message,
                result: ''
              });
            } else {
              res.json({
                status: '2',
                msg: '',
                result: "今日已签到"
              })
            }
          })
        } else {
          let newdoc = {
            date: date
          };
          doc.dailyAttendance.push(newdoc);
          doc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: "签到成功"
              })
            }

          })
        }
      }
    }
  })
})
// 查询购物车列表接口
router.get("/cartList", function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: '',
          result: doc.cart
        });
      }
    }
  })
});
// 查询购物车数量接口
router.get("/cartCount", function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({
      userId: userId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        let cartList = doc.cart;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum)
        });
        res.json({
          status: "0",
          msg: '',
          result: cartCount
        })

      }
    })
  }
})
// 购物车单一删除接口
router.post("/cartDel", function (req, res, next) {
  let userId = req.cookies.userId,
    productId = req.body.productId;
  User.update({
    'userId': userId
  }, {
    $pull: {
      'cart': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  });
});
// 购物车批量删除接口
router.post("/cartDelCheck",function(req,res,next){
  let userId = req.cookies.userId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        let goodsList=[];
        doc.cart.forEach(item=>{
          if(item.checked!="1"){
            goodsList.push(item)
          }
        })
        doc.cart=goodsList;
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: "1",
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: "success"
            })
          }
        });
      }
    }
  })
})
//购物车修改接口
router.post("/cartEdit", function (req, res, next) {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({
      'userId': userId,
      'cart.productId': productId
    }, {
      'cart.$.productNum': productNum,
      'cart.$.checked': checked
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    })
});
// 购物车全选接口 
router.post("/cartAllChecked", function (req, res, next) {
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll ? "1" : "0";
  User.findOne({
    'userId': userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        doc.cart.forEach(item => {
          item.checked = checkAll
        });
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: "1",
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: "0",
              msg: '',
              result: 'success'
            })
          }
        })
      }
    }
  })
})
// 查询地址接口
router.get("/addressList", function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({
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
        status: "0",
        msg: '',
        result: doc.addressList
      });
    }
  })
})
// 添加地址接口
router.post("/addressAdd", function (req, res, next) {
  let userId = req.cookies.userId,
    userName = req.body.userName,
    addressInfo = req.body.addressInfo,
    tel = req.body.tel,
    defaultCheck = req.body.defaultCheck;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let month = (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let date = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
      let hour = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
      let min = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
      let sec = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      let addressId = "add" + new Date().getFullYear() + "" + month + date + hour + min + sec + r1 + r2;
      newdoc = {
        addressId: addressId,
        userName: userName,
        addressInfo: addressInfo,
        tel: tel,
        isDefault: defaultCheck
      }
      doc.addressList.push(newdoc)
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: "0",
            msg: '',
            result: 'success'
          })
        }
      })

    }
  })
})
// 查询地址详情接口
router.post("/addressFind", function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      doc.addressList.forEach(item => {
        if (item.addressId == addressId) {
          res.json({
            status: '0',
            msg: '',
            result: item
          })
        }
      })
    }
  })
})
// 修改地址信息接口
router.post("/addressEdit", function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId,
    userName = req.body.userName,
    addressInfo = req.body.addressInfo,
    tel = req.body.tel,
    defaultCheck = req.body.defaultCheck;
  User.update({
      'userId': userId,
      'addressList.addressId': addressId
    }, {
      'addressList.$.userName': userName,
      'addressList.$.addressInfo': addressInfo,
      'addressList.$.tel': tel,
      'addressList.$.isDefault': defaultCheck,
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    })
})
// 删除地址接口
router.post("/addressDel", function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({
    'userId': userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  });
});
// 生成订单接口
router.post("/payment", function (req, res, next) {
  let userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId;
  User.findOne({
    userId: userId
  }, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let address = '',
        goodsList = [];
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })
      doc.cart.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      })
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let month = (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let date = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
      let hour = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
      let min = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
      let sec = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      let orderId = "OR" + new Date().getFullYear() + "" + month + date + hour + min + sec + r1 + r2;
      let createDate = new Date().getFullYear() + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
      let newdoc = {
        orderId: orderId,
        orderTotal: orderTotal,
        address: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(newdoc);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: err.message,
            result: ''
          });
        } else {
          // 返回订单的id和订单的总金额给前端，下一个页面要用到
          res.json({
            status: "0",
            msg: '',
            result:{
              doc1,
              orderId:newdoc.orderId
            }
          });
        }
      });
    }
  })
})
// 查询订单列表接口
router.get("/orderList", function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: '',
          result: doc.orderList
        });
      }
    }
  })
});
//查询订单详情接口
router.post("/orderFind", function (req, res, next) {
  let userId = req.cookies.userId,
    orderId = req.body.orderId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      doc.orderList.forEach(item => {
        if (item.orderId == orderId) {
          res.json({
            status: '0',
            msg: '',
            result: item
          })
        }
      })
    }
  })
})
// 订单删除接口
router.post("/orderDel", function (req, res, next) {
  let userId = req.cookies.userId,
    orderId = req.body.orderId;
  User.update({
    'userId': userId
  }, {
    $pull: {
      'orderList': {
        'orderId': orderId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  });
});
// 登录校验
// router.get("checkLogin",function(req,res,next){
//   if(req.cookies.userId){
//     res.json({
//       status:"0",
//       msg:"",
//       result:
//     })
//   }
// });
module.exports = router;