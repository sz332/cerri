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
    minimize(graph, cycles, filter) {
        let goodPaths = [];

        let paths = cycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        for (let path of paths) {

            if (!filter(path.original)) {
                continue;
            }

            // found at least an edge to be removed
            let removedEdge = false;

            // for every edge in the path
            for (let edge of path.edges) {
                if (graph.hasEdge(edge)) {
                    removedEdge = true;
                    graph.removeEdge(edge);
                }
            }

            // if the path removed at least a single edge, add it to the list
            if (removedEdge) {
                goodPaths.push(path.original);
            }

            if (graph.edgeCount() == 0) {
                break;
            }
        }

        return goodPaths;
    }



}