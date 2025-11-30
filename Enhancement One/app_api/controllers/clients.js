const Client = require('../models/client');

// GET /api/clients - list all clients
const clientsList = async (req, res) => {
    try {
        const clients = await Client.find().exec();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/clients/:id - get a single client
const clientsFindById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).exec();
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/clients/:id - update client
const clientsUpdate = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    clientsList,
    clientsFindById,
    clientsUpdate
};
