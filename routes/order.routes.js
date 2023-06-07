const express = require('express');
const api = express.Router();
const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');
const checkToken = require('../middlewares/isAuth');
const checkUserRole = require('../middlewares/checkRole');

api.get('/order', checkToken ,checkUserRole, orderController.getOrders)
api.get('/myorders',checkToken,orderController.getOrdersByUser)

api.post('/order' , checkToken,orderController.addOrder)

api.delete('/order/:id' , checkToken,checkUserRole,orderController.deleteOrder)


module.exports = api;