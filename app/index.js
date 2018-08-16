// This is an application format of the drill generator. The reason the application
// was developed is because the current solution was very slow, so slow, that it
// broke the browser. Running as a separate application this shall be not a problem
// hopefully

var Graph = require("graphlib").Graph;
var Fs = require('fs');

class GraphLoader{

    constructor(fileName){
        this.fileName = fileName;
    }

    load(){
        return this.createGraph(this.fileName);
    }

    convertJsonToGraph(json) {
        let data = {};
    
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
    
        return data;
    }
    
    createGraph(fileName) {
        let graphData = this.convertJsonToGraph(JSON.parse(Fs.readFileSync(fileName, 'utf8')));
        let graph = new Graph();
    
        for (let node of graphData.nodes) {
            graph.setNode(node.id, node.label);
        }
    
        for (let edge of graphData.edges) {
            graph.setEdge(edge.from, edge.to);
        }
    
        return graph;
    }
}

let graph = new GraphLoader("data/cerri.json").load();

console.log("Now what");

//https://github.com/dagrejs/graphlib/wiki/API-Reference#alg-find-cycles