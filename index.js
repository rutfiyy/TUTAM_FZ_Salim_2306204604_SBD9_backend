const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://tutam-fz-salim-2306204604-sbd-9-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));
app.use('/item', require('./src/routes/item.route'));
app.use('/transaction', require('./src/routes/transaction.route'));
app.use('/card', require('./src/routes/card.route'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});