//https://gist.github.com/axdg/5653b533a515355853e1

'use strict';

let Graph = require("graphlib").Graph;

/**
 * This class sorts the generated cycles. The current idea is the following:
 * sort the cycles based on hamming distance. Get the edges from the graph as 
 * a edge_count length of 1 and 0. For every cycle go for every edge (bit)
 * and set it to 1 where the edge exist. 
 */
module.exports = class GraphCycleSorter {

    /**
     * 
     * @param {Graph} graph 
     * @param {Array} cycles 
     */
    constructor(graph, cycles) {
        this.graph = graph;
        this.cycles = cycles;
        this.edges = this._convertGraphEdgesToMap(graph);
    }

    /**
     * Sort paths so that the hamming distance is minimal between each other
     * 
     * @returns {Array} sorted cycles
     */
    sortCycles() {
        let retValue = [];

        // this looks like again like an NP problem, great... :(

        return retValue;
    }

    _hammingDistance(source, target) {

        if (source.length < target.length) {
            source = source + Array.apply(null, { length: (target.length - source.length) }).map(Function.call, x => 0).join('');
        }

        if (target.length < source.length) {
            target = target + Array.apply(null, { length: (source.length - target.length) }).map(Function.call, x => 0).join('');
        }

        let distance = 0;

        for (let i = 0; i < source.length; i++) {
            if (source[i] !== target[i]) {
                distance++;
            }
        }

        return distance;
    }

    _convertGraphEdgesToMap(graph) {
        let edges = [];

        let counter = 0;

        for (let edge of graph.edges()) {
            edges[edge.v + ":" + edge.w] = counter++;
        }

        return edges;
    }

    _convertPathToBinaryString(edges, path) {
        let retValue = Array.apply(null, { length: this.graph.edgeCount() }).map(Function.call, x => 0);

        for (let i = 0; i < path.length; i++) {
            let from = path[i];
            let to = path[(i + 1) % path.length];
            retValue[edges[from + ":" + to]] = 1;
        }

        return retValue.join('');
    }



}