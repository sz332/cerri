// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var Graph = require("graphlib").Graph;
var GraphLoader = require("./graphloader.js");
var GraphParser = require("./graphparser.js");

let graph = new GraphLoader("data/cerri.json").load();

let parser = new GraphParser(graph);

let cycles = parser.findCycles();

console.log("Now what");

//https://github.com/dagrejs/graphlib/wiki/API-Reference#alg-find-cycles
// https://basarat.gitbooks.io/typescript/docs/quick/nodejs.html