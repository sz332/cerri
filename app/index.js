// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var Graph = require("graphlib").Graph;
var GraphLoader = require("./graphloader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");

//let graph = new GraphLoader("../data/cerri.json").load();

//let cycleFinder = new GraphCycleFinder(graph);

//let cycles = cycleFinder.findCycles(6);


let myGraph = new Graph({directed: true});

myGraph.setNode("a");
myGraph.setNode("b");
myGraph.setNode("c");
myGraph.setNode("d");

myGraph.setEdge("a","b");
myGraph.setEdge("b","c");
myGraph.setEdge("c","d");
myGraph.setEdge("d","a");

let minimizer = new GraphMinimizer(myGraph);
let minimalCycles = minimizer.minimalCoveringCycles([["a","b","c","d"]]);

console.log("Now what");

//https://github.com/dagrejs/graphlib/wiki/API-Reference#alg-find-cycles
// https://basarat.gitbooks.io/typescript/docs/quick/nodejs.html