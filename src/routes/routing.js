const express = require('express');
const router = express.Router();
const setupdb = require('../model/setupdb');
const mCartService = require('../service/users');

router.get('/setupdb', async (req, res, next) => {
    try {
        let successResponse = await setupdb();
        res.json(successResponse)
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        let username = req.body.userName;
        let password = req.body.password;
        let successResponse = await mCartService.login(username, password);
        req.session.userName = username;
        req.session.password = password;
        res.json(successResponse)
    } catch (err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
    try {
        let userData = req.body;
        let successResponse = await mCartService.register(userData);
        res.json(successResponse);
    } catch (err) {
        next(err);
    }
})

let verifyUser = async (req, res, next) => {
    let username = req.session.userName;
    let password = req.session.password;
    try {
        let successResponse = await mCartService.login(username, password);
        if (successResponse) next();
    } catch (err) {
        let error = new Error("Please Login to continue");
        error.status = 403;
        next(error);
    }
}

router.get('/products', verifyUser, async (req, res, next) => {
    try {
        let products = await mCartService.getAllProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
})

router.get('/product/:productId', verifyUser, async (req, res, next) => {
    try {
        let productId = req.params.productId;
        let productDetails = await mCartService.getProductById(productId);
        res.json(productDetails)
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

router.all('*', (req, res, next) => {
    res.json({ "message": "Invalid Request" })
})


module.exports = router;
