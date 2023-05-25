const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./routes/routing');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');

app.use(bodyParser.json());
app.use(session({ secret: "user session", resave: true, saveUninitialized: true }));
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);

app.listen(3000, () => {
    console.log("server running at port 3000")
})

