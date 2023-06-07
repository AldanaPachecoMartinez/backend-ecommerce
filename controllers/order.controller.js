const {responseCreator} = require("../utils/utils");
const Order = require("../schemas/order.schema");
const Product = require("../schemas/product.schema");
const User = require("../schemas/user.schema");
const {ObjectId} = require('mongoose');
require('dotenv').config();



async function getOrders(req, res) {
    let  totalFound=0
    let query = null
    if(req.query.search){
        query= { $or: [
            { status: { $regex: `.*${req.query.search}.*`, $options: 'i' } }
        ]}
    }

    if(req.query.userId){
        query = { userId: req.query.userId}
    }


    try {
        let findOrders=[]
        if(query){
            totalFound = await Order.count(query);
            findOrders = await Order.find(query)
                .collation({ locale:  'es' })
                .sort({createdAt: -1})
                .lean()
        }else{
            findOrders = await Order.find()
                    .collation({ locale:  'es' })
                    .sort({createdAt: -1})
                    .lean()
            totalFound = await Order.count();

        }
        
        for (const order of findOrders) {
            const userData = await User.findById(order.userId);
            order.User = userData;
        }

        const totalOrders = await Order.countDocuments();

        return responseCreator(res, 200, `Ordenes obtenidas correctamente`, true, {findOrders,totalOrders,totalFound})
    
    } catch (error) {
        console.log(error)
            return responseCreator(res, 400, `No se encontraron ordenes`, false)
    }
    
}



async function getOrdersByUser(req, res) {
        query = { userId: req.user._id}


    try {
        let findOrders=[]
        
            totalFound = await Order.count(query);
            findOrders = await Order.find(query)
                .collation({ locale:  'es' })
                .sort({createdAt: -1})
                .lean()
        
        for (const order of findOrders) {
            const userData = await User.findById(order.userId);
            order.User = userData;
        }

        const totalOrders = await Order.countDocuments();

        return responseCreator(res, 200, `Ordenes obtenidas correctamente`, true, {findOrders,totalOrders,totalFound})
    
    } catch (error) {
        console.log(error)
            return responseCreator(res, 400, `No se encontraron ordenes`, false)
    }
    
}



async function addOrder(req,res){
    let totalPrice =0
    let products=[]


    for (let i = 0; i < req.body.products.length; i++) {
        const prod = req.body.products[i];
        let prodFromDb= await Product.findById(prod.product)
        totalPrice+= (prodFromDb.price * prod.quantity)

        products.push({
            product:prod.product,
            quantity:prod.quantity,
            price:prodFromDb.price

        })
    }


    let newOrder = {
        orderProducts:products,
        userId:req.user._id,
        shippingAddress:req.body.shippingAddress,
        totalPrice,
        paymentResult:{
            id:"",
            status:"Pending",
            update_time:Date.now,
            email_address:req.user.email
        },
        phoneNumber:req.body.phoneNumber
    }

    try {
        const orderToAdd = new Order(newOrder);
        await orderToAdd.save()        
        responseCreator(res,200,'La orden se agregó correctamente. En unos instantes nos comunicaremos con usted',true,{orderToAdd})
    } catch (error) {
        return responseCreator(res,400,'No se pudo agregar la orden',false,{error})
    }
}

async function deleteOrder(req, res) {
    try {
        const id = req.params.id;

        const orderDeleted = await Order.findByIdAndDelete(id);

        if(!orderDeleted) return responseCreator(res,404,`No se encontró la orden a borrar`, false)

        return responseCreator(res, 200, `La orden fue borrada correctamente`,true);

    } catch (error) {
        console.log(error);
        return responseCreator(res,400,`No se pudo borrar la orden`, false)}
    }

module.exports = {
    getOrders,
    addOrder,
    deleteOrder,
    getOrdersByUser
}