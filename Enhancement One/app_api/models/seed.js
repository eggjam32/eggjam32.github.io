// seed.js
const mongoose = require('./db');
const Client = require('./client');
const User = require('./User');
const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('./data/clients.json', 'utf8'));

const seedDB = async () => {
  try {
    // Clear collections
    await Client.deleteMany({});
    await User.deleteMany({});

    // Insert clients
    const insertedClients = await Client.insertMany(clientsData.filter(c => c.role === 'client'));
    console.log('Clients inserted!');

    // Create users
    for (const data of clientsData) {
      const user = new User({
        name: data.name,
        email: data.email,
        role: data.role,
        clientRef: data.role === 'client'
          ? insertedClients.find(c => c.name === data.name)._id
          : null
      });
      user.setPassword('Password123'); // default password
      await user.save();
    }

    console.log('Users created!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
