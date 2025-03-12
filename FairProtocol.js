const FairRandom = require('./FairRandom');

class FairProtocol {
    static determineFirstMove() {
        return FairRandom.generateFairRandom(2);
    }

    static chooseRandomVal() {
        return FairRandom.generateFairRandom(6);
    }

    static chooseRandomDice(limit) {
        return FairRandom.generateSecureRandom(limit);
    }
}

module.exports = FairProtocol;