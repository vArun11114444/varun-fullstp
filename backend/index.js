const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
const connectDB = require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    });
