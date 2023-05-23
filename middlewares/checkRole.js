const { responseCreator } = require("../utils/utils");

const checkUserRole = (req, res, next) => {
    console.log(req.user)
    const {role} = req.user;
    if(!role) {
        return responseCreator(res, 404, `El rol es inexistente, verifique el token`, false)
    }

    if( role !== 'ADMIN_ROLE' && role !== 'SUPERADMIN_ROLE') {
        return responseCreator(res, 403, `Acceso denegado: el usuario no posee las credenciales necesarias.`, false)
    }

    next();
}

module.exports = checkUserRole;