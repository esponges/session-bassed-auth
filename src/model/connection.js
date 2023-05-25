const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: { type: String, required: [true, 'userName is mandatory'], unique: true },
    password: { type: String, required: [true, 'Password is mandatory'] },
    emailId: { type: String, required: [true, 'emailId is mandatory'] },
    contactNo: { type: Number, required: [true, 'contactNo is mandatory'] }
})

const productSchema = mongoose.Schema({
    productId: { type: Number, unique: true },
    productName: { type: String, required: [true, 'productName is required'] },
    category: { type: String, required: [true, 'category is required'] },
    description: { type: String, required: [true, 'description is required'] },
    price: { type: Number, required: [true, 'price is required'] },
    rating: { type: Number, required: [true, 'rating is required'] },
    manufacturer: { type: String, required: [true, 'manufacturer is required'] }
})

let throwError = (message, statusCode) => {
    let err = new Error(message);
    err.status = statusCode
    throw err;
}

let connection = {}

connection.createConnection = () => {
    return mongoose.connect('mongodb://localhost:27017/mCartDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
}

connection.getUserCollection = async () => {
    try {
        let database = await connection.createConnection();
        let userModel = await database.model('Users', userSchema);
        return userModel;
    } catch (err) {
        throwError('Database Connection Failed', 500)
    }
}

connection.getProductsCollection = async () => {
    try {
        let database = await connection.createConnection();
        let productsModel = await database.model('Products', productSchema)
        return productsModel;
    } catch (err) {
        throwError('Database Connection Failed', 500)
    }
}


module.exports = connection;



