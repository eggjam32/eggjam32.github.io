
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Client = require('../models/client');

// JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded;
    if (decoded.role !== 'admin') return res.sendStatus(403); // only admins
    next();
  });
}

// Get all clients
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Update a client
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

module.exports = router;
