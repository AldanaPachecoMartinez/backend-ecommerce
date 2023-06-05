const {responseCreator} = require("../utils/utils");
const Product = require("../schemas/product.schema");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;



async function getProducts(req, res) {
    const page = req.query.page;  
    const limit =  15; 
    const query = { $or: [
        { name: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
        { category: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
        { resume: { $regex: `.*${req.query.search}.*`, $options: 'i' } },
        { description: { $regex: `.*${req.query.search}.*`, $options: 'i' } }


    ]}
    try {
        const findProducts = await Product.find(
        query
        )
            .collation({ locale:  'es' })
            .sort({createdAt: -1})
            .skip(page * limit)
            .limit(limit)
            
        const totalProducts = await Product.countDocuments();
        const totalFound = await Product.count(query);

        return responseCreator(res, 200, `Productos obtenidos correctamente`, true, {findProducts, totalProducts, totalFound})

    
    } catch (error) {
        console.log(error)
            return responseCreator(res, 400, `No se encontraron productos`, false)
    }
    
}

async function addProducts(req, res) {
    try {
        const productToAdd = new Product(req.body);
        await productToAdd.save()        
        responseCreator(res,200,'El producto se agregó correctamente',true,{productToAdd})
    } catch (error) {
        return responseCreator(res,400,'No se pudo agregar el producto',false,{error})
    }
}




async function deleteProducts(req, res) {
    try {
        const id = req.params.id;

        const productDeleted = await Product.findByIdAndDelete(id);

        if(!productDeleted) return responseCreator(res,404,`No se encontró el producto a borrar`, false)

        return responseCreator(res, 200, `El producto fue borrado correctamente`,true, {name: productDeleted.name});

    } catch (error) {
        console.log(error);
        return responseCreator(res,400,`No se pudo borrar el producto`, false)}
    }

async function updateProducts(req, res) {
    try {
        const id = req.params.id;

        const productUpdated = await Product.findByIdAndUpdate(id,req.body);

        if(!productUpdated) return responseCreator(res,404,`No se encontró el producto a editar`, false)

        return responseCreator(res, 200, `El producto fue actualizado correctamente`,true, {name: productUpdated.name});

    } catch (error) {
        console.log(error);
        return responseCreator(res,400,`No se pudo editar el producto`, false)
    }
}

module.exports = {
    getProducts,
    addProducts,
    deleteProducts,
    updateProducts
}