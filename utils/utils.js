
const responseCreator = (res, status, msg, ok, data = []) => {
    return res.status(status).send({msg,ok,...data})
}

module.exports = {responseCreator}