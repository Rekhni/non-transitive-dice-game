const ConfigParser = require('./ConfigParser');
const Game = require('./Game');

const args = process.argv.slice(2);

try {
    const diceConfigurations = ConfigParser.parseDiceInput(args);
    const game = new Game(diceConfigurations);
    game.play();
} catch (error) {
    console.error(`Error: ${error.message}`);
    console.log("Usage: node index.js <dice1> <dice2> <dice3> ...");
}

