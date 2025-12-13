const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    accountType: { type: String, enum: ['brokerage', 'retirement'], required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
