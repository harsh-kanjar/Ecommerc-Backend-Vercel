const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true,
    unique: true
  },
  password:{
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  },
});

// CREATING MODELS USING SCHEMA
const User = mongoose.model('user',UserSchema);
module.exports = User;