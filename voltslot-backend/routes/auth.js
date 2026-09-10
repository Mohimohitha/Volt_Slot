const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration API Route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const newUser = new User({
        email,
        password
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully into VoltSlot!" });
});

module.exports = router;