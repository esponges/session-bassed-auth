/* configuration to access secret keys from .env file */
require('dotenv').config()

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let refreshTokens = [];

router.post('/login', (req, res, next) => {
    const userName = req.body.userName;
    /* Payload - along with userName, also contains issued at time and expiry time */
    const user = { name: userName, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) };
    /* jwt.sign() creates the JSON Web Token */
    const accessToken = jwt.sign({ name: userName, exp: Math.floor(Date.now() / 1000) + 60 }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    /* Adds the refresh token to an array to ensure the intruder cannot use any random token as refresh token */
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
})

router.post("/generate-token", (req, res) => {
    /* Fetches the refresh token from request body */
    const refreshToken = req.body.token;
    /* Chekcs if refresh token belongs to the user */ 
    if (!refreshToken && !refreshTokens.includes(refreshToken)) {
        res.status(403);
        res.json({ message: "User not authenticated" });
    }
    else {
        /* decodes and verifies the refresh token */ 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (!err) {
                /* generates a new access token and sends the response */
                const accessToken = jwt.sign({ username: user.name, exp: Math.floor(Date.now() / 1000) + 60 }, process.env.ACCESS_TOKEN_SECRET);
                res.json({ accessToken });
            } else {
                res.status(403)
                res.json({ message: "User not authenticated" });
            }
        });
    }

});


function verifyToken(req, res, next) {
    /* Fetches the authorization data from the request header */
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) { res.status(401); res.json({ message: "Token not available" }) }
    else {
        /* Verifies the token fetched from the request header */
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            /* Checks if there is any error */
            if (err) { res.status(403); res.json({ message: "User is not Authenticated" }) }
            /* Navigates to the next route method */
            else {
                req.user = user;
                next();
            }
        })
    }
}

router.get('/products', verifyToken, (req, res, next) => {
    let user = req.user;
    res.json({ user: user, product: { productName: 'Google Pixel 3a', price: 'USD 500' } })
})

module.exports = router;