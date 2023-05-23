const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const URL = process.env.MONGO_URL;
const port = process.env.PORT || 4000;
const DbName = process.env.DB_NAME;

const dbConnect = async () => {
    await mongoose.connect(URL + DbName);

    console.log(`\x1b[93m Conexión correcta a la DataBase  \x1b[37m`);
    app.listen(port, ()=> {
        console.log(`\x1b[95m Servidor corriendo en el puerto ${port} \x1b[37m`)
    })
}

dbConnect().catch(error => console.error(`Error al conectar con la DataBase`, error));