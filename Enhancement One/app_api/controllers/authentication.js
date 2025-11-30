const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
    const { name, email, password, role, clientRef } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role, clientRef });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, role: user.role });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// LOGIN
const login = (req, res, next) => {
    passport.authenticate('local', { session: true }, (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(401).json(info);

        req.logIn(user, err => {
            if (err) return res.status(500).json(err);

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token, role: user.role, clientRef: user.clientRef });
        });
    })(req, res, next);
};

module.exports = { register, login };
