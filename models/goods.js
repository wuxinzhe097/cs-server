let mongoose=require('mongoose')
let Schema=mongoose.Schema;

var productSchema=new Schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productDescription":String,
    "checked": String,
    "productNum":String
})

module.exports=mongoose.model('good',productSchema)