class ProbabilityCalculator {
    static calculateWinningProbabilities(diceSet) {
        const numDice = diceSet.length;
        const winMatrix = Array(numDice).fill(null).map(() => Array(numDice).fill(0));

        for (let i = 0; i < numDice; i++) {
            for (let j = 0; j < numDice; j++) {
                if (i !== j) {
                    let wins = 0, total = 0;
                    for (let faceA of diceSet[i]) {
                        for (let faceB of diceSet[j]) {
                            if (faceA > faceB) {
                                wins++;
                            }
                            total++;
                        }
                    }
                    winMatrix[i][j] = wins === 0 ? 0 : Number((wins / total).toFixed(4));
                } else {
                    winMatrix[i][j] = "- (0.3333)";
                }
            }
        }
        return winMatrix;
    }

}

module.exports = ProbabilityCalculator;