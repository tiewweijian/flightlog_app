const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.isAdmin = async (req, res, next) => {
    try {
        const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);

        if (user.username !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admins only' });
        }

        next();
    } catch (err) {
        console.error('Middleware error:', err.message);
        res.status(500).send('Server error');
    }
};