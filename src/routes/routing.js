const express = require('express');
const router = express.Router();
const setupdb = require('../model/setupdb');
const mCartService = require('../service/users');
const jwt = require('jsonwebtoken');

router.get('/setupdb', async (req, res, next) => {
    try {
        let successResponse = await setupdb();
        res.json(successResponse)
    } catch (err) {
        next(err)
    }
})

// router.post('/login', async (req, res, next) => {
//     try {
//         let username = req.body.userName;
//         let password = req.body.password;
//         let successResponse = await mCartService.login(username, password);
//         req.session.userName = username;
//         req.session.password = password;
//         res.json(successResponse)
//     } catch (err) {
//         next(err)
//     }
// })

router.post('/login', (req, res, next) => {
    try {
        const userName = req.body.userName;
        /* Payload - along with userName, also contains issued at time and expiry time */ 
        const user = { name: userName, iat: Math.floor(Date.now() / 1000) - 60, exp: Math.floor(Date.now() / 1000) + (60 * 60) };
        /* jwt.sign() creates the JSON Web Token */
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken });
    } catch (err) {
        next(err);
    }
});

router.get('/products', (req, res, next) => {
    /* Fetches the authorization data from the request header */
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    /* Checks if the JWT is existing in the request header */
    if (!token) { res.status(401); res.json({ message: "Token not available" }) }
    else {
        /* Verifies the token fetched from the request header */
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            /* Checks if there is any error */
            if (err) { res.status(403); res.json({ message: "Invalid Request" }) }
            /* Sends User Data and product data as response if token is verified successfully */
            else res.json({ user: user, product: { productName: 'Google Pixel 3a', price: 'USD 500' } })
        })
    }
});

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
