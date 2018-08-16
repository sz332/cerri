var Graph = require("graphlib").Graph;
var Alg = require("graphlib").alg;
var Fs = require('fs');

function convertJsonToGraph(json) {
    let data = {};

    console.info("Started processing data");

    data.nodes = json.nodes;
    data.edges = [];

    for (let item of json.edges) {
        for (let toNode of item.toList) {

            if (typeof toNode === 'string' || toNode instanceof String) {
                data.edges.push({
                    "from": item.from,
                    "to": toNode
                });
            } else {
                data.edges.push({
                    "from": item.from,
                    "to": toNode.name
                });
            }

        }
    }

    console.info("Finished processing data");
    return data;
}

let graphData = convertJsonToGraph(JSON.parse(Fs.readFileSync('data/cerri.json', 'utf8')));
let graph = new Graph();

for (let node of graphData.nodes){
    graph.setNode(node.id, node.label);
}

for (let edge of graphData.edges){
    graph.setEdge(edge.from, edge.to);
}

let cycles = Alg.findCycles(graph);

console.log("Now what");

//https://github.com/dagrejs/graphlib/wiki/API-Reference#alg-find-cycles