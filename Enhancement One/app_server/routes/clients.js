// app_server/routes/clients.js
const express = require('express');
const router = express.Router();
const Client = require('../../app_api/models/client');

// Middleware to check client session
function ensureClient(req, res, next) {
  if (req.session.user && req.session.user.role === 'client') {
    next();
  } else {
    res.redirect('/');
  }
}

router.use(ensureClient);

router.get('/', async (req, res) => {
  try {
    const clientDoc = await Client.findById(req.session.user.clientRef);
    const client = clientDoc.toObject();
    res.render('clientDashboard', { client });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching client data');
  }
});



module.exports = router;
