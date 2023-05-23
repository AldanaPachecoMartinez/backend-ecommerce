const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller');
const checkToken = require('../middlewares/isAuth');
const checkUserRole = require('../middlewares/checkRole');

api.get('/users', checkToken, checkUserRole, userController.getUsers);

api.post('/users', userController.addUsers);
api.post('/login', userController.loginUser);

api.delete('/users/paramId', checkToken, checkUserRole, userController.deleteUser)


module.exports = api;