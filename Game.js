const readline = require('readline');
const Dice = require('./Dice');
const FairProtocol = require('./FairProtocol');
const ProbabilityCalculator = require('./ProbabilityCalculator');
const TableFormatter = require('./TableFormatter');

class Game {
    constructor(diceSet) {
        this.diceSet = diceSet.map(faces => new Dice(faces));
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        this.isUserFirst = false;
    }

    async promptUser(question) {
        return new Promise(resolve => this.rl.question(question, answer => resolve(answer.trim())));
    }

    async determineFirstMove() {
        const { key, computerNumber, hmac } = FairProtocol.determineFirstMove();
        console.log(`Let's determine who makes the first move.`);
        console.log(`I selected a random value in the range 0..1 (HMAC=${hmac}).`);
        console.log('Try to guess my selection.');
        console.log('0 - 0\n1 - 1');
        console.log('X - exit\n? - help');

        let userGuess = await this.promptUser("Your selection: ");

        if (userGuess.toLowerCase() === 'x') {
            console.log('Exiting...');
            process.exit(0);
        }

        if (userGuess === '?') {
            const winMatrix = ProbabilityCalculator.calculateWinningProbabilities(this.diceSet.map(dice => dice.faces));
            TableFormatter.formatProbabilityTable(this.diceSet.map(dice => dice.faces), winMatrix);
            return this.determineFirstMove();
        }
        while (!['0', '1'].includes(userGuess)) {
            userGuess = await this.promptUser("Invalid input. Guess 0 or 1: ");
        }

        console.log(`My selection: ${computerNumber} (KEY=${key})`);
        return computerNumber === parseInt(userGuess, 10) ? 'user' : 'computer';
    }

    async play() {
        const firstMover = await this.determineFirstMove();

        let availableDice = [...this.diceSet];
        let userDice, computerDice;

        if (firstMover === 'computer') {
            computerDice = availableDice.splice(FairProtocol.chooseRandomDice(availableDice.length), 1)[0];
            console.log(`I make the first move and choose the [${computerDice.faces}] dice.`);
            console.log('Choose your dice: ')
            availableDice.forEach((dice, i) => {
                console.log(`${i} - [${dice.faces}]`);
            })
            console.log('X - exit\n? - help');
            let userChoice = await this.promptUser("Your selection: ");
            if (userChoice.toLowerCase() === 'x') {
                console.log('Exiting...');
                process.exit(0);
            }
            userDice = availableDice[parseInt(userChoice, 10)];
            console.log(`You choose the [${userDice.faces}] dice.`)
        } else {
            this.isUserFirst = true;
            console.log("You make the first move!")
            console.log("Choose Your dice: ")
            availableDice.forEach((dice, i) => {
                console.log(`${i} - [${dice.faces}]`);
            })
            console.log('X - exit\n? - help');
            let userChoice = await this.promptUser("Your selection: ");
            if (userChoice.toLowerCase() === 'x') {
                console.log('Exiting...');
                process.exit(0);
            }
            userDice = availableDice.splice(parseInt(userChoice, 10), 1)[0];
            console.log(`You choose [${userDice.faces}] dice.`);
            computerDice = availableDice[FairProtocol.chooseRandomDice(availableDice.length)];
            console.log(`I choose [${computerDice.faces}] dice.`);
        }

        await this.takeTurns(userDice, computerDice);
        this.rl.close();
    }

    async takeTurns(userDice, computerDice) {
        let { key: compKey1, computerNumber: computerNumberChoice1, hmac: compHMAC1 } = FairProtocol.chooseRandomVal();
        let { key: compKey2, computerNumber: computerNumberChoice2, hmac: compHMAC2 } = FairProtocol.chooseRandomVal();
        let userThrow, computerThrow;
        if (this.isUserFirst) {
            console.log("It's time for your throw.")
        } else {
            console.log("It's time for my throw.")
        }
        console.log(`I selected a random value in the range 0..5 (HMAC=${compHMAC1})`);
        console.log('Add your number modulo 6.');
        console.log('0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5');
        console.log('X - exit\n? - help');
        let userNumberChoice1 = await this.promptUser("Your selection: ");
        if (userNumberChoice1.toLowerCase() === 'x') {
            console.log('Exiting...');
            process.exit(0);
        }
        if (userNumberChoice1 === '?') {
            const winMatrix = ProbabilityCalculator.calculateWinningProbabilities(this.diceSet.map(dice => dice.faces));
            TableFormatter.formatProbabilityTable(this.diceSet.map(dice => dice.faces), winMatrix);
            userNumberChoice1 = await this.promptUser("Your selection: ");
        }
        userNumberChoice1 = parseInt(userNumberChoice1, 10);
        console.log(`My number is ${computerNumberChoice1} (KEY=${compKey1})`);
        let result1 = Math.floor((userNumberChoice1 + computerNumberChoice1) % 6);
        if (this.isUserFirst) {
            userThrow = userDice.roll(result1);
        } else {
            computerThrow = computerDice.roll(result1);
        }
        console.log(`The result is ${computerNumberChoice1} + ${userNumberChoice1} = ${result1} (mod 6).`);
        if (this.isUserFirst) {
            console.log(`You throw is ${userThrow}`);
        } else {
            console.log(`My throw is ${computerThrow}`);
        }
        
    
        if (this.isUserFirst) {
            console.log("It's time for my throw.")
        } else {
            console.log("It's time for your throw.")
        }
        console.log(`I selected a random value in the range 0..5 (HMAC=${compHMAC2})`);
        console.log('Add your number modulo 6.');
        console.log('0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5');
        console.log('X - exit\n? - help');
        let userNumberChoice2 = await this.promptUser("Your selection: ");
        if (userNumberChoice2.toLowerCase() === 'x') {
            console.log('Exiting...');
            process.exit(0);
        }
        if (userNumberChoice2 === '?') {
            const winMatrix = ProbabilityCalculator.calculateWinningProbabilities(this.diceSet.map(dice => dice.faces));
            TableFormatter.formatProbabilityTable(this.diceSet.map(dice => dice.faces), winMatrix);
            userNumberChoice2 = await this.promptUser("Your selection: ");
        }
        userNumberChoice2 = parseInt(userNumberChoice2, 10);
        console.log(`My number is ${computerNumberChoice2} (KEY=${compKey2})`);
        let result2 = Math.floor((userNumberChoice2 + computerNumberChoice2) % 6);
        if (this.isUserFirst) {
            computerThrow = computerDice.roll(result2);
        } else {
            userThrow = userDice.roll(result2);
        }
        console.log(`The result is ${computerNumberChoice2} + ${userNumberChoice2} = ${result2} (mod 6).`);
        if (this.isUserFirst) {
            console.log(`My throw is ${computerThrow}`);
        } else {
            console.log(`Your throw is ${userThrow}`);
        }
        
    
        console.log(userThrow > computerThrow ? `You win (${userThrow} > ${computerThrow})!` : `I win (${userThrow} < ${computerThrow})!`);
    }
}

module.exports = Game;
