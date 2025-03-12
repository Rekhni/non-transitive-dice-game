class ConfigParser {
    static parseDiceInput(args) {
        if (args.length < 3) {
            throw new Error('You must provide at least 3 dice configurations.');
        }

        const dice = args.map((arg, index) => {
            const faces = arg.split(',').map(Number);
            if (faces.length !== 6 || faces.some(isNaN)) {
                throw new Error(`Invalid dice format at argument ${index + 1}. Each dice must have 6 integers`);
            }
            return faces;
        });

        return dice;
    }
}

module.exports = ConfigParser;

