'use strict';

let Graph = require("graphlib").Graph;

module.exports = class GraphParser {

    constructor(graph) {
        this.graph = graph;
    }

    findCycles() {
        let result = [];
        this.graph.nodes().forEach(node => this.cycleRecursive(node, this.graph, [], result));
        return result;
    }

    cycleRecursive(current, graph, path, result) {

        // if the path is too long, we will skip it, we don't need cycles consisting of more than 6 exercises
        if (path.length > 6) {
            return;
        }

        if (path.length > 0) {

            // we found a current, self-returning circle
            if (path[0] === current) {
                console.info("Found a cycle, path = " + path + " # of cycles = " + result.length);
                path.push(current);
                result.push(path);
                return;
            }

            // we already found a path and a circle, this is not what we want
            if (path.includes(current)) {
                return;
            }
        }

        let outEdges = this.graph.outEdges(current);

        outEdges.forEach(edge => {
            let clonedArray = path.slice(0);
            clonedArray.push(current);
            this.cycleRecursive(edge.w, this.graph, clonedArray, result);
        });

    };

}