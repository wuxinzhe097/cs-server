let mongoose = require('mongoose')
let Schema = mongoose.Schema;

var userSchema = new Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "userImg": String,
    "userSign": {
        type: String,
        default: "暂时没有设置自己的签名哦~",
    },
    "cart": [{
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productImage": String,
        "checked": String,
        "productNum": String
    }],
    "dailyAttendance": [{
        "date": String
    }],
    "orderList": [{
        "orderStatus":String,
        "orderId": String,
        "orderTotal":Number,
        "createDate": String,
        "address":Object,
        "goodsList":Array,
    }],
    "sleepList": Array,
    "addressList": [{
        "addressId": String,
        "userName": String,
        "addressInfo": String,
        "tel": Number,
        "isDefault": {
            type: Boolean,
            default: false,
        },
    }]
})

module.exports = mongoose.model('user', userSchema)