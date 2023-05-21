const express = require('express');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/user.routes')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors());
app.use([
    user_routes
])

module.exports = app;