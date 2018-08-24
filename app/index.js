// TODO

// Use modular folder structure for various parts: graph loaders, graph parsers, graph transformations, graph statistics, graph exporters, etc.
// ...

// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var GraphLoader = require("./src/graphLoader.js");
var GraphCycleFinder = require("./src/graphCycleFinder.js");
var GraphMinimizer = require("./src/graphMinimizer.js");
var GraphStatistics = require("./src/graphStatistics.js");
var AdvantageousMinimizer = require("./src/minimizers/advantageousMinimizer.js");
var PdfGenerator = require("./src/pdfGenerator.js");
var ArgumentParser = require('argparse').ArgumentParser;
var path = require('path')

const {
    performance
} = require('perf_hooks');

// [ Here it starts ]----------------------------------------------------------------------

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
        defaultValue: '../data/cerri'
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

let args = parser.parseArgs();

console.info("Starting application...");

// Maximum number of moves in a drill. Setting it to 6 requires around 6 seconds, 
// setting it to 8 requires around 10 minutes on a core i3 desktop processor

const MAX_CYCLE_LENGTH = args.maxCycleLength;
const DIR_LOCATION = path.resolve(args.dataDir);
const GRAPH_LOCATION = path.resolve(args.dataDir, args.graphFileName);
const EXPORT_LOCATION = path.resolve(args.export);

// display argument informations

console.info("Maximum length of the cycle: " + MAX_CYCLE_LENGTH);
console.info("Data directory: " + DIR_LOCATION);
console.info("Graph file location: " + GRAPH_LOCATION);
console.info("Output file location: " + EXPORT_LOCATION);

// Start performance measurement

let start = performance.now();

// Load the graph

let data = new GraphLoader(GRAPH_LOCATION).load();
let graph = data.graph;

// Find the cycles

let cycles = new GraphCycleFinder(graph).findCycles(MAX_CYCLE_LENGTH);

// Among the cycles find the minimal amount which cover the whole graph using a provided algorithm

let minimalCycles = new GraphMinimizer(graph, new AdvantageousMinimizer()).minimalCoveringCycles(cycles);

// Display end result

let duration = performance.now() - start;

for (let pathObject of minimalCycles.paths) {
    console.log("\n Exercises of " + pathObject.length + " moves: \n");

    let counter = 1;

    for (let path of pathObject.data) {
        console.info(counter++ + ". " + path.join(", "));
    }
}

// Display statistics about the graph

let cycleGoodness = new GraphStatistics(graph).getCycleGoodness(minimalCycles.paths);

console.log("Edge count in graph = " + cycleGoodness.graphEdgeCount);
console.log("Edge count in cycles = " + cycleGoodness.cyclesEdgeCount);
console.log("Goodness ratio = " + parseFloat(cycleGoodness.ratio).toFixed(3));
console.log("Cycles have " + (parseFloat((cycleGoodness.ratio - 1) * 100).toFixed(0)) + " % more edges than the original graph (learning cost)");

// generate pdf
let generator = new PdfGenerator(data.data.nodes, minimalCycles.paths.map(x => x.data).reduce((a, b) => a.concat(b), []), DIR_LOCATION, EXPORT_LOCATION);
generator.generate("output.pdf");

// Display time spent for calculating the result
console.info("Ended in " + (duration / 1000) + " sec");