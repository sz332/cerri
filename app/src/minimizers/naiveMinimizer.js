'use strict';

let Graph = require("graphlib").Graph;

module.exports = class NaiveMinimizer {

    /*
     * 
     * 
     * 
     * @param {Graph} graph The clone of the original graph
     * @param {Array} cycles The cycles we want to check
     * @param {Array} filter Filter to be applied to each circle. Returns true, if the circle needs to be processed.
     */
    minimize(graph, paths, filter) {
        let goodPaths = [];

        let cycles = paths.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        for (let cycle of cycles) {

            if (!filter(cycle.original)) {
                continue;
            }

            // found at least an edge to be removed
            let removedEdge = false;

            // for every edge in the path
            for (let edge of cycle.edges) {
                if (graph.hasEdge(edge)) {
                    removedEdge = true;
                    graph.removeEdge(edge);
                }
            }

            // if the path removed at least a single edge, add it to the list
            if (removedEdge) {
                goodPaths.push(cycle.original);
            }

            if (graph.edgeCount() == 0) {
                break;
            }
        }

        return {
            paths: goodPaths,
            remainingEdges: graph.edges()   
        };
    }

    name(){
        return "Naive minimizer";
    }



}