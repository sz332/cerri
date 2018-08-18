// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");

const {
    performance
} = require('perf_hooks');

let start = performance.now();

let graph = new GraphLoader("../data/cerri.json").load();

let cycles = new GraphCycleFinder(graph).findCycles(8);
let minimalCycles = new GraphMinimizer(graph).minimalCoveringCycles(cycles);

for (let pathObject of minimalCycles.paths) {
    console.log("\n Exercises of " + pathObject.length + " moves: \n");

    let counter = 1;

    for (let path of pathObject.data) {
        console.info(counter++ + ". " + path.join(", "));
    }
}

let duration = performance.now() - start;

console.info("Ended in " + (duration / 1000) + " sec");