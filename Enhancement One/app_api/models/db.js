const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/investment_app`;
const readLine = require('readline');

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {}), 1000);
};

// Connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => console.log('Mongoose connection error: ', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Graceful shutdown
const gracefulShutdown = (msg) => {
    mongoose.connection.close(() => console.log(`Mongoose disconnected through ${msg}`));
};

if (process.platform === 'win32') {
    const r1 = readLine.createInterface({ input: process.stdin, output: process.stdout });
    r1.on('SIGINT', () => process.emit("SIGINT"));
}

process.once('SIGUSR2', () => { gracefulShutdown('nodemon restart'); process.kill(process.pid, 'SIGUSR2'); });
process.on('SIGINT', () => { gracefulShutdown('app termination'); process.exit(0); });
process.on('SIGTERM', () => { gracefulShutdown('app shutdown'); process.exit(0); });

// Make initial connection
connect();

// Import models
require('./User');
require('./client'); // new client model

module.exports = mongoose;
