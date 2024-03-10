const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists and is verified
    if (token) {
        jwt.verify(token, 'Group5Secret', (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
    // next();
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('checkUser middleware called');

    if (token) {
        jwt.verify(token, 'Group5Secret', async (err, decodedToken) => {
            if (err) {
                console.log('JWT verification error:', err.message);
                res.locals.user = null;
                next();
            } else {
                console.log('JWT verified:', decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        console.log('No JWT token found');
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };
