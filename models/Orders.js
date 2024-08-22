const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }  
    }],
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    status:{type: String, default:"pending"},
    paymentMode: {type:String,required: true},
    totalPrice: { type: Number, required: true }, // Storing total price of the order
    couponCode: { type: String }, // Optional field for the coupon code
    dateOrdered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Orders', OrdersSchema);
