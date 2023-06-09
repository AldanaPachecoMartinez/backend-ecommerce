const express = require('express');
const api = express.Router();
const productController = require('../controllers/product.controller');
const uploadController = require('../controllers/upload.controller');
const checkToken = require('../middlewares/isAuth');
const checkUserRole = require('../middlewares/checkRole');

api.get('/products', productController.getProducts);
api.get('/products/:id', productController.getProductById);

api.post('/products/order', productController.getProductsInOrder);
api.post('/products', checkToken , checkUserRole , uploadController.uploadProductImage,productController.addProducts);
api.post('/products/image/:id', checkToken, checkUserRole, uploadController.uploadProductImage,productController.updateProducts)

api.delete('/products/:id',checkToken,checkUserRole,productController.deleteProducts)
api.delete('/products/image/:img',checkToken,checkUserRole, uploadController.deleteImageProduct)

api.put('/products/:id',checkToken,checkUserRole,productController.updateProducts)
module.exports = api;