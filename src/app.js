const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/routing');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');

app.use(bodyParser.json());
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);

app.listen(3000, () => {
    console.log("server running on port 3000");
})