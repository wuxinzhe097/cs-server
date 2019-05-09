let express=require('express');
let router=express.Router();
let Goods=require('../models/goods'); 
// 查询商品列表接口
router.get('/',function(req,res,next){
   Goods.find({},function(err,doc){
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
   })
})
// 查询商品详情接口
router.post('/findGoods',function(req,res,next){
    let productId=req.body.productId;
    Goods.findOne({"productId":productId},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                res.json({
                    status:'0',
                    msg:'',
                    result:doc
                })
            }
        }
    })
})
// 加入购物车接口
router.post('/addCart',function(req,res,next){
     let userId=req.cookies.userId,productId=req.body.productId;
     let User=require('../models/users');
     User.findOne({"userId":userId},function(err,userDoc){
         if(err){
             res.json({
                 status:'1',
                 msg:err.message
             })
         }else{
            //  console.log("doc"+userDoc);
             if(userDoc){
                 let goodsItem='';
                 userDoc.cart.forEach(item => {
                     if(item.productId==productId){
                         goodsItem=item;
                         item.productNum++;
                     }
                 });

                 if(goodsItem){
                    userDoc.save(function(err2,doc2){
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:"successs"
                            })
                        }

                    })
                 }else{
                    Goods.findOne({productId:productId},function(err1,doc){
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err.message
                            })
                        }else{
                            if(doc){
                                newdoc = {
                                    _id:doc._id,
                                    productId: doc.productId,
                                    producName: doc.producName,
                                    salePrice: doc.salePrice,
                                    productName: doc.productName,
                                    productImage: doc.productImage,
                                    productNum: "1",
                                    checked: "1",
                                 }
                                
                                userDoc.cart.push(newdoc);
                                userDoc.save(function(err2,doc2){
                                    if(err2){
                                        res.json({
                                            status:'1',
                                            msg:err.message
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:"successs"
                                        })
                                    }
    
                                })
                            }
                        }
                     })
                 }
                
             }
         }
     })
})

module.exports=router;