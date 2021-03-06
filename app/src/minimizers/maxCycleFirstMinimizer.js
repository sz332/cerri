'use strict';

let Graph = require("graphlib").Graph;

module.exports = class MaxCycleFirstMinimizer {

    /**
     * Start from maximum length of cycles. While there is any edge in the graph, check if 
     * there is a cycle which can remove the max amount of edges. If there is, then add it to the list.
     * If there is no cycle, then decrease the max number, and re-check the cycles until no edge remains
     * in the graph.
     * 
     * @param {Graph} graph The clone of the original graph
     * @param {Array} paths The cycles we want to check
     * @param {Array} filter Filter to be applied to each circle. Returns true, if the circle needs to be processed.
     */
    minimize(graph, paths, filter) {

        let max = paths.map(x => x.length).reduce((acc, x) => Math.max(acc, x));

        let goodPaths = [];

        let cycles = paths.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        while ((graph.edgeCount() > 0) && (max !== 0)) {

            let found = false;

            for (let cycle of cycles) {

                if (!filter(cycle.original)) {
                    continue;
                }

                let edgeCount = cycle.edges.filter(edge => graph.hasEdge(edge)).length;

                if (edgeCount === max) {
                    found = true;
                    cycle.edges.filter(edge => graph.hasEdge(edge)).forEach(edge => graph.removeEdge(edge));
                    goodPaths.push(cycle.original);

                    if (!graph.hasEdge()) {
                        break;
                    }
                }

            }

            if (!found) {
                max--;
            }
        }

        return {
            paths: goodPaths,
            remainingEdges: graph.edges()   
        };
    }

    name(){
        return "Max cycles first minimizer";
    }



}