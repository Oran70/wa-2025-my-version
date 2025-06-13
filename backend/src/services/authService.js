const jwt = require('jsonwebtoken');

class AuthService {

    generateToken(payload, expiresIn = '24h') {
        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn });
    }

    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret', { expiresIn: '7d' });
    }
}

module.exports = new AuthService();
