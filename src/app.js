const express = require('express');
const app = express();
const router = require('./routes/routing');
const errorLogger = require('./utilities/errorLogger');
const requestLogger = require('./utilities/requestLogger');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(session({ secret: "user session", resave: true, saveUninitialized: true }));
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);

app.listen(3000, () => {
    console.log("server running in port 3000");
})
