const express = require('express');
const router = express.Router();
const User = require('../../app_api/models/User');

// Render login page
router.get('/', (req, res) => {
    res.render('login', { title: 'Login', error: null });
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// app_server/routes/index.js
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    // Session for client users
    if (user.role === 'client') {
      req.session.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        clientRef: user.clientRef
      };
      
      return res.redirect('/clients'); // Express site
    }

    // Admin users -> generate JWT for Angular SPA
    const token = user.generateJWT();
    return res.redirect(`http://localhost:4200?token=${token}`);
    
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Login', error: 'Something went wrong' });
  }
});



module.exports = router;
