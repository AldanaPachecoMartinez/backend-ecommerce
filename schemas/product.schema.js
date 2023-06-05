const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, 
        required: true, 
        minlength:3 , 
        maxlength:150 },
    price: { type: Number, 
        required: true
        },
    resume:  { type: String, 
        required: true,
        minlength: 0,
        maxlength: 150 }, 
    description:{ type: String, 
        required: true,
        minlength: 0,
        maxlength: 250 },
    thumbnail: { type: String },
    images: { type: Array},
    category:{ type:String, required:true },
    stock:{ type:Number, default:0 },
    favorite: {type:Boolean,default:false},
    createdAt:{type:Date,default: Date.now()}
})

module.exports = mongoose.model('Product', ProductSchema)