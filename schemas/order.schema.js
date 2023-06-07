const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderProducts: {type: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product id', required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
        }
    ],
    validate: {
        validator: function (value) {
        return value.length > 0
        },
        message: 'Los productos no pueden estar vacios.',
        }
    },
    userId: { type: Schema.Types.ObjectId, required: true,
    ref: 'User que hizo la order' },
    createdAt: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Pendiente', 'En proceso', 'Enviado'], default: 'Pendiente' },
    updatedAt: { type: Date, required: true, default: Date.now },
    shippingAddress: { address: String, city: String,  postalCode: String },
    totalPrice: { type: Number, required: true },
    paymentMethod: String,
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    phoneNumber:{type:String, min:6, max:120}
})

module.exports = mongoose.model('Order', OrderSchema);