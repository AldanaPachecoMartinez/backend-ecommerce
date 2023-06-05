const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const checkToken = require('../middlewares/isAuth');
const checkUserRole = require('../middlewares/checkRole');

api.get('/users', checkToken, checkUserRole, userController.getUsers);
api.get('/user', checkToken, userController.getUserById);

api.post('/users', userController.addUsers);
api.post('/login', userController.loginUser);
api.post('/users/image',checkToken, uploadController.uploadUserImage, userController.setUserImage);

api.delete('/users/:paramId', checkToken, checkUserRole, userController.deleteUser);

api.put('/users/:id', checkToken, checkUserRole, userController.updateUserByAdmin);
api.put('/users', checkToken, userController.updateUserByUser);


module.exports = api;