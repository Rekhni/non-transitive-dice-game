const crypto = require('crypto');

class FairRandom {
    static generateSecureRandom(limit) {
        return crypto.randomInt(0, limit);
    }

    static generateHMAC(key, message) {
        return crypto.createHmac('sha3-256', key).update(message.toString()).digest('hex');
    }

    static generateFairRandom(limit) {
        const key = crypto.randomBytes(32).toString('hex');
        const computerNumber = FairRandom.generateSecureRandom(limit);
        const hmac = FairRandom.generateHMAC(key, computerNumber);
        return { key, computerNumber, hmac };
    }
}

module.exports = FairRandom;
