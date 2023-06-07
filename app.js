const express = require('express');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/user.routes')
const product_routes = require('./routes/product.routes')
const order_routes = require('./routes/order.routes')
const views_routes = require('./routes/views.routes')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors());
app.use([
    user_routes,
    product_routes,
    order_routes,
    views_routes
])

module.exports = app; 