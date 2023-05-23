const {responseCreator} = require("../utils/utils");
const User = require("../schemas/user.schema");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { response } = require("../app");
require('dotenv').config();
const secret = process.env.SECRET;

async function getUsers(req, res) {
    const page = req.query.page; 
    const limit =  5; 
    try {
        const findUsers = await User.find({}, { password: 0 }).collation({ locale:  'es' }).sort({age: -1}).limit(limit).skip(page * limit);

        const totalUsers = await User.countDocuments();

        return responseCreator(res, 200, `Usuarios obtenidos correctamente`, true, {findUsers, totalUsers})

    
    } catch (error) {
        console.log(error)
            return responseCreator(res, 400, `No se encontraron usuarios`, false)
    }
    
}

async function addUsers(req, res) {
    try {
        const userToAdd = new User(req.body);
        const {password} = req.body;
        const passHash = await bcrypt.hash(password, saltRounds);
        userToAdd.password = passHash;
        const userSaved = await userToAdd.save();
        userSaved.password = undefined;
        return responseCreator(res, 201, `El usuario se registró correctamente`, true, {userSaved} );
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
        return responseCreator(res, 400, `El email ya existe`, false)}
        return responseCreator(res,400, `No se pudo crear el usuario`, false)
    }
}

async function loginUser(req,res) {
    try {
        const {email, password} = req.body;
        const userToLogin = await User.findOne({email});
        if(!userToLogin) {
            return responseCreator(res,404, `Los datos proporcionados son incorrectos`, false );
        }
        const correctPassword = await bcrypt.compare(password, userToLogin.password)
        if(!correctPassword){
            return responseCreator(res,404, `Los datos proporcionados son incorrectos`, false );
        }
        userToLogin.password = undefined;
        const token = await jwt.sign(userToLogin.toJSON(), secret, { expiresIn: '2h'});
        return responseCreator(res,200,`Login correcto, te redireccionaremos en unos instantes...`,true,{user:userToLogin,token})

    } catch (error) {
        console.log(error);
        return responseCreator(res,400,`Error al loguearse`,false)
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.paramId;

        const userDeleted = await User.findByIdAndDelete(id);

        if(!userDeleted) return responseCreator(res,404,`No se encontró el usuario a borrar`, false)

        return responseCreator(res, 200, `El usuario fue borrado correctamente`,true, {name: userDeleted.fullName, email: userDeleted.email});

    } catch (error) {
        console.log(error);
        return responseCreator(res,400,`No se pudo borrar el usuario`, false)}
    }

module.exports = {
    getUsers,
    addUsers,
    loginUser,
    deleteUser
}