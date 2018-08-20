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

        let goodPaths = this.algorithm.minimize(graph, cycles, filter);

        console.log("Found minimal number of covering cycles, cycle count = " + goodPaths.length);

        // minimalize the number of paths

        info.minimizedSize = goodPaths.length;

        // return the paths, and the remaining edges, if any
        return {
            paths: this._groupPathsBySize(goodPaths),
            info: info
        };
    }

    /**
     * Groups paths by length
     * @param {*} pathList 
     */
    _groupPathsBySize(pathList) {

        let lastSize = 0;
        let sameSizeList = [];

        let list = [];

        for (let path of pathList) {

            if (lastSize == 0) {
                lastSize = path.length;
            }

            if (path.length == lastSize) {
                sameSizeList.push(path);
            } else {
                list.push({
                    length: lastSize,
                    data: sameSizeList
                });

                sameSizeList = [];
                sameSizeList.push(path);
                lastSize = path.length;
            }
        }

        if (lastSize !== 0) {
            list.push({
                length: lastSize,
                data: sameSizeList
            });
        }

        return list;
    };

}