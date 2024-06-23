const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send('Access denied');
    jwt.verify(token, 'chat-bot', (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.username = decoded.userName;
        console.log("decoded.username : ",decoded.userName)
        next();
    });
};

module.exports = verifyJWT