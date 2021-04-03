// TODO Use modular folder structure for various parts: graph loaders, graph parsers, graph transformations, graph statistics, graph exporters, etc.

// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var ArgumentParser = require('argparse').ArgumentParser;
var Main = require('./src/main.js');

class App {

    run() {
        let args = this._parseArguments();
        let main = new Main(args.maxCycleLength,
            args.dataDir,
            args.graphFileName,
            args.export,
            args.minimizer,
            args.removeNodes === "" ? [] : args.removeNodes.split(",").map(x => x.trim())
        );

        main.run();
    }

    _parseArguments() {
        let parser = new ArgumentParser({
            version: '1.0.0',
            addHelp: true,
            description: 'FencingAutomat drill generator'
        });

        parser.addArgument(
            '--maxCycleLength', {
                help: 'Maximum cycle length',
                defaultValue: 6
            }
        );

        parser.addArgument(
            '--dataDir', {
                help: 'Data directory where the graph description file reside',
                defaultValue: '../data/leboucher'
            }
        );

        parser.addArgument(
            '--graphFileName', {
                help: 'The name of the graph file inside --dataDir',
                defaultValue: 'graph.json'
            }
        );

        parser.addArgument(
            '--export', {
                help: 'The name of the pdf file',
                defaultValue: 'graph.pdf'
            }
        );

        parser.addArgument(
            '--minimizer', {
                help: 'The cycle minimizer algorithm',
                defaultValue: 'naive',
                choices: ['naive', 'maxCycleFirst', 'advanageous']
            }
        );

        parser.addArgument(
            '--removeNodes', {
                help: 'Remove the provided node before optimization. Usable in case we would like to limit the drills to certain actions. Separate the nodes with comma "," character.',
                defaultValue: ''
            }
        );

        return parser.parseArgs();
    }

}


// [ Application starts here ]----------------------------------------------------------------------

let app = new App();
app.run();
