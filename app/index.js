// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");
var GraphStatistics = require("./graphStatistics.js");

const {
    performance
} = require('perf_hooks');

// Maximum number of moves in a drill. Setting it to 6 requires around 6 seconds, 
// setting it to 8 requires around 10 minutes on a core i3 desktop processor
const MAX_CYCLE_LENGTH = 6

// Start performance measurement

let start = performance.now();

// Load the graph

let graph = new GraphLoader("../data/cerri.json").load();

// Find the cycles

let cycles = new GraphCycleFinder(graph).findCycles(MAX_CYCLE_LENGTH);

// Among the cycles find the minimal amount which cover the whole graph

let minimalCycles = new GraphMinimizer(graph).minimalCoveringCycles(cycles);

// Display end result

let duration = performance.now() - start;

for (let pathObject of minimalCycles.paths) {
    console.log("\n Exercises of " + pathObject.length + " moves: \n");

    let counter = 1;

    for (let path of pathObject.data) {
        console.info(counter++ + ". " + path.join(", "));
    }
}

let cycleGoodness = new GraphStatistics(graph).getCycleGoodness(minimalCycles.paths);

console.log("Edge count in graph = " + cycleGoodness.graphEdgeCount);
console.log("Edge count in cycles = " + cycleGoodness.cyclesEdgeCount);
console.log("Goodness ratio = " + parseFloat(cycleGoodness.ratio).toFixed(3));
console.log("Cycles have " + (parseFloat((cycleGoodness.ratio - 1) * 100).toFixed(0)) + " % more edges than the original graph");

// Display time spent for calculating the result
console.info("Ended in " + (duration / 1000) + " sec");