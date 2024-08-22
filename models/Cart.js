const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Cart schema
const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', CartSchema);
