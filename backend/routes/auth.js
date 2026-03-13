const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'street_tsukkomi_secret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);

        const stmt = db.prepare('INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)');
        const result = stmt.run(email, hashedPassword, nickname);

        const token = jwt.sign({ id: result.lastInsertRowid, email, nickname }, JWT_SECRET);
        res.status(201).send({ user: { email, nickname }, token });
    } catch (e) {
        res.status(400).send({ error: 'Email already exists or invalid data.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, JWT_SECRET);
        res.send({ user: { email: user.email, nickname: user.nickname }, token });
    } catch (e) {
        res.status(500).send({ error: 'Server error' });
    }
});

// Get Current User
router.get('/me', require('../middleware/auth'), (req, res) => {
    res.send({ user: req.user });
});

module.exports = router;
