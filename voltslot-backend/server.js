const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB Database connection established successfully');
});

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('VoltSlot API Server Engine is Running Smoothly');
});

app.listen(PORT, () => {
    console.log(`Server is actively running on port: ${PORT}`);
});