let mongoose=require('mongoose')
let Schema=mongoose.Schema;

var talkSchema=new Schema({
    "talkId":String,
    "userId":String,
    "userName":String,
    "userImg": String,
    "createTime":String,
    "talkTitle":String,
    "talkInfo":String,
    "comment":Array
})

module.exports=mongoose.model('talk',talkSchema)