const jwt = require('jsonwebtoken');

const requireToken = (req, res, next) => {
    const token = req.cookies.userToken;
    if(token) {
        jwt.verify(token, 'super secret phrase', (error, unhashedToken) => {
            if(error) {
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

module.exports = {requireToken};