/* configuration to access secret keys from .env file */
require('dotenv').config()

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userService = require('../service/users');

router.post('/register', async (req, res, next) => {
    try {
        let userObj = req.body;
        let registeredUser = await userService.register(userObj);
        res.json({ message: `${registeredUser.userName} registered successfully` })
    } catch (err) {
        next(err);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const userObj = req.body;
        const userData = await userService.login(userObj);
        let jwtPayload = { userName: userData.userName, iat: Math.floor(Date.now() / 1000) - 60, exp: Math.floor(Date.now() / 1000) + (60 * 60) };
        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET);
        res.json({ message: `${userData.userName} logged in successfully`, accessToken: accessToken });
    } catch (err) {
        next(err);
    }
})

let verifyToken = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (!accessToken) { err.status = 401; err.message = "Invalid Request"; next(err) }
    else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) { err.status = 403; err.message = "Token Expired! Please Login to continue"; next(err) }
            else {
                req.currentUser = payload;
                next();
            }
        })
    }
}

router.put('/place-order', verifyToken, async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let orderData = req.body;
        let newOrderId = await userService.placeOrder(currentUser, orderData);
        if (newOrderId) res.json({ message: `Order placed Successfully. Order Id: ${newOrderId}` });
    } catch (err) {
        next(err);
    }
})

router.get('/orders', verifyToken, async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let ordersArray = await userService.getOrders(currentUser);
        res.json(ordersArray);
    } catch (err) {
        next(err);
    }
})

module.exports = router;