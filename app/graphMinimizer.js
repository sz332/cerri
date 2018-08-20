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

    constructor(graph) {
        this.graph = graph;
    }

    minimalCoveringCycles(originalCycles, filter) {

        if (filter === undefined) {
            filter = function(path) {
                return true;
            }
        }

        console.info("Calculating minimal coverage cycles...");

        // clone the original graph

        let graph = new Graph({ directed: true });

        for (let node of this.graph.nodes()) {
            graph.setNode(node);
        }

        for (let edge of this.graph.edges()) {
            graph.setEdge(edge);
        }

        // clone the original cycles

        let cycles = originalCycles.slice(0);

        // the good paths store

        let info = {
            originalSize: cycles.length
        }

        let goodPaths = this._selectMaxEdgeAlgorithm(graph, cycles, filter);

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
     * Start from maximum length of cycles. While there is any edge in the graph, check if 
     * there is a cycle which can remove the max amount of edges. If there is, then add it to the list.
     * If there is no cycle, then decrease the max number, and re-check the cycles until no edge remains
     * in the graph.
     * 
     * @param {*} graph The graph
     * @param {*} cycles The cycles we want to check
     * @param {*} filter Filter to be applied to each circle. Returns true, if the circle needs to be processed.
     */
    _selectMaxEdgeAlgorithm(graph, cycles, filter) {

        let max = cycles.map(x => x.length).reduce((acc, x) => Math.max(acc, x));

        let goodPaths = [];

        let paths = cycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        while (graph.edgeCount() > 0 || max == 0) {

            let found = false;

            for (let path of paths) {

                if (!filter(path.original)) {
                    continue;
                }

                let edgeCount = path.edges.filter(edge => graph.hasEdge(edge)).length;

                if (edgeCount === max) {
                    found = true;
                    path.edges.filter(edge => graph.hasEdge(edge)).forEach(edge => graph.removeEdge(edge));
                    goodPaths.push(path.original);

                    if (graph.edgeCount() == 0) {
                        break;
                    }
                }

            }

            if (!found) {
                max--;
            }
        }

        return goodPaths;
    }

    _naiveAlgorithm(graph, cycles, filter) {
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