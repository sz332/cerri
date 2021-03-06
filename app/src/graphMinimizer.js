'use strict';

let Graph = require("graphlib").Graph;

/**
 * Returns the minial list cycles which cover the graph
 * 
 * The algorithm does the following:
 * 
 * it goes through the list of cycles found by orderedCycle method from the 
 * paths containing the smallest amount of nodes, to the largest one
 * 
 * for each path
 *  for each segment of the path
 *      if the segment is part of the graph's edges, then remove the edge
 *
 *  if at least a single edge was removed, the path is good, add it to our list

 *  Finally return the list of paths, and information about reduction:
 * 
 *  originalSize: the original number of cycles
 *  minimizedSize: the size after minimizin the list by the algorithm
 *  edges: remaining edges
 * 
 */
module.exports = class GraphMinimizer {

    constructor(graph, algorithm) {
        this.graph = graph;
        this.algorithm = algorithm;
    }

    _cloneGraph(graph) {
        let clone = new Graph({ directed: true });

        for (let node of graph.nodes()) {
            clone.setNode(node);
        }

        for (let edge of graph.edges()) {
            clone.setEdge(edge);
        }

        return clone;
    }

    minimalCoveringCycles(originalCycles, filter) {

        if (filter === undefined) {
            filter = function(path) {
                return true;
            }
        }

        console.info("Calculating minimal coverage cycles...");

        // clone the original graph

        let graph = this._cloneGraph(this.graph);

        // clone the original cycles

        let cycles = originalCycles.slice(0);

        // the good paths store

        let info = {
            originalSize: cycles.length
        }

        let result = this.algorithm.minimize(graph, cycles, filter);

        console.log("Found minimal number of cycles, cycle count = " + result.paths.length);

        // minimalize the number of paths

        info.minimizedSize = result.paths.length;

        // return the paths, and the remaining edges, if any
        return {
            paths: this._groupPathsBySize(result.paths),
            info: info,
            remainingEdges: result.remainingEdges
        };
    }

    /**
     * 
     * Groups paths by length
     * @param {Array} pathList 
     */
    _groupPathsBySize(pathList) {
        let list = [];

        for (let path of pathList) {

            let o = list.find(x => x.length == path.length);

            if (!o) {
                list.push({ length: path.length, data: [path] });
            } else {
                o.data.push(path);
            }
        }

        return list.sort((a, b) => a.length - b.length);
    }

}