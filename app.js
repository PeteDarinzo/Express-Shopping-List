const express = require('express');
const itemRoutes = require('./itemRoutes');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);


/** general error handler */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

module.exports = app;