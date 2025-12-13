/* GET HOMEPAGE */
const index = (req, res) => {
    const user = req.session?.user; // optional chaining

    if (user) {
        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin'); // SPA route
        } else if (user.clientRef) {
            return res.redirect(`/clients/${user.clientRef}`);
        }
    }

    // Render homepage if no user is logged in
    res.render('index', { 
        title: "Investment Bank Client Portal", 
        error: null 
    });
};

module.exports = {
    index
};
