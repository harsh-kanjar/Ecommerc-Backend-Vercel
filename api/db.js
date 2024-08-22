const mongoose = require('mongoose');
const mongoURI = " mongodb+srv://harshkanjar_admin:harsh_admin_007@cluster0.rzh65.mongodb.net/ecommerce?retryWrites=true&w=1 ";
// const mongoURI = 'mongodb://localhost:27017/ecommerce'

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = connectToMongo;


///mongoos.connect(mongoURI,() => {})   <- this method (callback) is no longer valid 