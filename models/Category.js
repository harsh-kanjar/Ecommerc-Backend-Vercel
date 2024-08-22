const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  name:{
    type: String,
    require: true
  },
  color:String,
  icon:String,
  image:String
  
});

// CREATING MODELS USING SCHEMA 
module.exports = mongoose.model('Category',CategorySchema);