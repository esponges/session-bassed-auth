const express = require('express');
const router = express.Router();
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
        let userObj = req.body;
        let userData = await userService.login(userObj);
        req.session.currentUser = userData;
        res.json({ message: `${userData.userName} logged in successfully` });
    } catch (err) {
        next(err);
    }
})

router.put('/place-order', async (req, res, next) => {
    try {
        let currentUser = req.session.currentUser;
        let orderData = req.body;
        let newOrderId = await userService.placeOrder(currentUser, orderData);
        if (newOrderId) res.json({ message: `Order placed Successfully. Order Id: ${newOrderId}` });
    } catch (err) {
        next(err);
    }
})

router.get('/orders', async (req, res, next) => {
    try {
        let currentUser = req.session.currentUser;
        let ordersArray = await userService.getOrders(currentUser);
        res.json(ordersArray);
    } catch (err) {
        next(err);
    }
})

router.delete('/logout', (req, res, next) => {
    try {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: "user logged out successfully" });
        })
    } catch (err) {
        next(err);
    }
})

module.exports = router;
