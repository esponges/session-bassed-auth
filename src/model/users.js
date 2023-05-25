const connection = require('./connection');

const mCartDB = {}

mCartDB.login = async (username) => {
    let userModel = await connection.getUserCollection();
    let userData = await userModel.findOne({ userName: username });
    return userData ? userData : null;
}

mCartDB.register = async (userData) => {
    let userModel = await connection.getUserCollection();
    let insertedUser = await userModel.create(userData);
    return insertedUser ? insertedUser : null;
}

mCartDB.getAllProducts = async () => {
    let productModel = await connection.getProductsCollection();
    let productsData = await productModel.find({}, { productId: 1, productName: 1, price: 1, _id: 0 });
    return productsData.length ? productsData : null
}

mCartDB.getProductById = async (productId) => {
    let productModel = await connection.getProductsCollection();
    let productDetails = await productModel.findOne({ productId: productId }, { productId: 1, productName: 1, price: 1, _id: 0 });
    return productDetails ? productDetails : null
}

module.exports = mCartDB;
