const Client = require('../../app_api/models/client');

/* GET client dashboard */
const clientDashboard = async function(req, res) {
    if (!req.session.user || req.session.user.role !== 'client') {
        return res.redirect('/');
    }

    try {
        const client = await Client.findById(req.session.user.clientRef);
        if (!client) {
            return res.render('clientDashboard', { title: "Client Dashboard", client: null, message: "Client data not found." });
        }
        res.render('clientDashboard', { title: "Client Dashboard", client, message: null });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    clientDashboard
};
