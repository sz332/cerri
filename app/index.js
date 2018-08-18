// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var Graph = require("graphlib").Graph;
var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");

let graph = new GraphLoader("../data/cerri.json").load();

let cycleFinder = new GraphCycleFinder(graph);
let cycles = cycleFinder.findCycles(8);

let minimizer = new GraphMinimizer(graph);
let minimalCycles = minimizer.minimalCoveringCycles(cycles);

for (let pathObject of minimalCycles.paths ){
        console.log("\n Exercises of " + pathObject.length + " moves: \n");

        let counter = 1;

        for (let path of pathObject.data){
            console.info(counter++ + ". " + path.join(", "));
        }
}

console.info("End.");