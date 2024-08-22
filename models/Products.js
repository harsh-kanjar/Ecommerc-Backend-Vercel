const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    require: true
  },
  description: String,
  richDescription: String,
  featuredImage: {
    type: String,
    require: true,
  },
  subImage1: String,
  subImage2: String,
  subImage3: String,
  brand: String,
  price: Number,
  category: String,
  countOfStock: {
    type: String,
    required: true
  },
  rating: Number,
  isFeatured: Number,
  category: {
    type: String,
    required: true
  },
  keywords: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
});

// CREATING MODELS USING SCHEMA 
module.exports = mongoose.model('Product', ProductSchema);