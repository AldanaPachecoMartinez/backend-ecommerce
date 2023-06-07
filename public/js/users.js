

async function obtenerUsuarios(){
        const token = localStorage.getItem('token')
        const response  = await axios.get(`${URL}/users`, {
            headers: {
                Authorization: token
            }
        })
        .then(res=>{
            const users = res.data.findUsers
            return users
        })
        .catch(err=>console.log(err))

return response
}

