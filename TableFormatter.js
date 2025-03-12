const Table = require('cli-table3');

class TableFormatter {
    static formatProbabilityTable(diceSet, winMatrix) {
        const diceLabels = diceSet.map(dice => dice.join(","));
        const maxLabelLength = Math.max(...diceLabels.map(label => label.length), 12); 
        const maxValueLength = Math.max(
            ...winMatrix.flat().map(value => value.toString().length),
            6 // Ensure probability values fit
        );
        const arrColWidths = [];
        const columnWidths = Math.max(maxLabelLength, ...Array(diceLabels.length).fill(maxValueLength));
        for (let i = 0; i < diceLabels.length + 1; i++) {
            arrColWidths.push(columnWidths.toString());
        }
        const table = new Table({
            head: ['User dice v', ...diceLabels],
            colWidths: arrColWidths,
        })

        for (let i = 0; i < diceLabels.length; i++) {
            const rowProbabilities = [diceLabels[i], ...winMatrix[i].map(value => value.toString())];
            table.push(rowProbabilities);
        }

        console.log(table.toString());
        
        // const columnWidth = Math.max(...diceLabels.map(label => label.length), 10) + 2;

        // const horizontalLine = `+${"-".repeat(columnWidth)}+${"-".repeat(columnWidth)}+${"-".repeat(columnWidth)}+${"-".repeat(columnWidth)}+`;

        // let output = "\nProbability of the win for the user:\n";
        // output += horizontalLine + "\n";
        // output += `| User dice v ${" ".repeat(columnWidth - 13)}| ${diceLabels.map(label => label.padEnd(columnWidth - 2)).join("| ")}|\n`;
        // output += horizontalLine + "\n";

        // for (let i = 0; i < diceSet.length; i++) {
        //     output += `| ${diceLabels[i].padEnd(columnWidth - 2)}| ${winMatrix[i].map(value => value.padEnd(columnWidth - 2)).join("| ")}|\n`;
        //     output += horizontalLine + "\n";
        // }

        // console.log(output);
    }
}

module.exports = TableFormatter;