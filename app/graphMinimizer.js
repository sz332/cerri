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

        let goodPaths = this.selectMaxEdgeAlgorithm(graph, cycles, filter);

        console.log("Found minimal number of covering cycles, cycle count = " + goodPaths.length);

        // minimalize the number of paths

        info.minimizedSize = goodPaths.length;

        // return the paths, and the remaining edges, if any
        return {
            paths: this.groupPathsBySize(goodPaths),
            info: info
        };
    }


    selectMaxEdgeAlgorithm(graph, cycles, filter) {

        let max = cycles.map(x => x.length).reduce((acc, x) => Math.max(acc, x));

        let goodPaths = [];

        let paths = cycles.map(path => ({ original: path, edges: path.map((x, i, array) => ({ v: x, w: array[(i + 1) % array.length] })) }));

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
                }
            }

            if (!found) {
                max--;
            }
        }

        return goodPaths;
    }

    naiveAlgorithm(graph, cycles, filter) {
        let goodPaths = [];

        for (let originalPath of cycles) {

            if (!filter(originalPath)) {
                continue;
            }

            // make a clone from the old path
            let path = originalPath.slice(0);

            // add the first element to the end of the list so that the path will be a cycle
            path.push(path[0]);

            // found at least an edge to be removed
            let removedEdge = false;

            // for every edge in the path
            for (let i = 0; i < path.length - 1; i++) {

                let source = path[i];
                let target = path[i + 1];

                if (graph.hasEdge(source, target)) {
                    removedEdge = true;
                    graph.removeEdge(source, target);
                }
            }

            // if the path removed at least a single edge, add it to the list
            if (removedEdge) {
                goodPaths.push(originalPath);
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
    groupPathsBySize(pathList) {

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