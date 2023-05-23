const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller');
const checkToken = require('../middlewares/isAuth');

api.get('/users', checkToken, userController.getUsers);
api.post('/users', userController.addUsers);
api.post('/login', userController.loginUser);


module.exports = api;