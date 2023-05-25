const usersDB = require('../model/users');

let userService = {}

let throwError = (errorMessage, statusCode) => {
    let err = new Error(errorMessage);
    err.status = statusCode;
    throw err;
}

userService.register = async (userObj) => {
    let registeredUser = await usersDB.register(userObj);
    return registeredUser ? registeredUser : throwError('User Registration Failed', 500);
}

userService.login = async (userObj) => {
    let userData = await usersDB.login(userObj.userName);
    if (!userData) {
        throwError('Email Id is not Registered', 404);
    } else if (userData.password !== userObj.password) {
        throwError('Invalid Password', 403);
    } else {
        return userData;
    }
}

userService.getOrders = async (currentUser) => {
    if (currentUser) {
        let ordersObj = await usersDB.getOrders(currentUser.userName);
        if (ordersObj.orders.length) return ordersObj.orders
        else throwError("Seems You havent shopped with us yet... Get started now", 404);
    } else {
        throwError("Please Login to Continue", 403);
    }
}

userService.placeOrder = async (currentUser, orderData) => {
    if (currentUser) {
        let newOrderId = await usersDB.placeOrder(currentUser.userName, orderData);
        if (newOrderId) return newOrderId;
        else throwError('Order could not be completed! Please try again', 500);
    } else {
        throwError("Please Login to Continue", 403);
    }
}

module.exports = userService;
