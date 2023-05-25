const mCartDB = require('../model/users');

const mCartService = {}

const throwError = (errMessage, errStatus) => {
    let err = new Error(errMessage);
    err.status = errStatus;
    throw err;
}

mCartService.login = async (username, password) => {
    let userData = await mCartDB.login(username);
    return userData ?
        (userData.password === password) ? 
        { message: "user logged In Successfully" } : throwError('Invalid Credentials', 403) : throwError('Invalid Credentials', 403)
}

mCartService.register = async (userData) => {
    let registeredUser = await mCartDB.register(userData);
    return registeredUser ? { message: 'User Registration Successful' } : throwError('User Registration Failed', 500)
}

mCartService.getAllProducts = async () => {
    let products = await mCartDB.getAllProducts();
    return products ? products : throwError('No Product Available', 404)
}

mCartService.getProductById = async (productId) => {
    let productDetails = await mCartDB.getProductById(productId);
    return productDetails ? productDetails : throwError('Product details not found', 404)
}

module.exports = mCartService;
