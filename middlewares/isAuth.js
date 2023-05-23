const { responseCreator } = require('../utils/utils');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

function checkToken(req, res, next) {
    const token = req.headers.authorization;
    if(!token) {
        return responseCreator(res, 400, `Token inexistente`, false);
    }

    jwt.verify(token, secret, (error, payload) => {
        if(error) {
            console.log(error)
            return responseCreator(res, 403, `Token inválido, permisos denegados`, false)
        }
        req.user = payload
        console.log(payload)
        next();
    })
}

module.exports = checkToken;