'use strict';

let Graph = require("graphlib").Graph;

module.exports = class AdvantageousMinimizer {

    /*
     * 
     * 
     * 
     * @param {Graph} graph The clone of the original graph
     * @param {Array} cycles The cycles we want to check
     * @param {Array} filter Filter to be applied to each circle. Returns true, if the circle needs to be processed.
     */
    minimize(graph, cycles, filter) {

        let max = cycles.map(x => x.length).reduce((acc, x) => Math.max(acc, x));

        let goodPaths = [];

        let paths = cycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        let edgeCountMap = {};

        // egy él hány körben fordul elő

        for (let cycle of cycles) {
            for (let i = 0; i < cycle.length; i++) {
                let k = cycle[i] + ":" + (i == cycle.length - 1 ? cycle[0] : cycle[i + 1]);
                if (k in edgeCountMap) {
                    edgeCountMap[k]++;
                } else {
                    edgeCountMap[k] = 1;
                }
            }
        }

        while (graph.edgeCount() > 0 || max == 0) {
            console.log("Remaining edges:" + graph.edgeCount() + " " + max);

            // mi a minimális száma ennek a hány körben fordul előnek

            let ecc = [];
            let ech = {};

            for (let k in edgeCountMap) {
                if (ecc[edgeCountMap[k]] == undefined) {
                    ecc[edgeCountMap[k]] = 1;
                    ech[edgeCountMap[k]] = 1;
                } else {
                    ecc[edgeCountMap[k]]++;
                    ech[edgeCountMap[k]]++;
                }
            }

            // 

            let minOcc = 0;
            for (let i = 1; i < ecc.length; i++) {
                if (ecc[i] !== undefined) {
                    minOcc = i;
                    break;
                }
            }

            // check out if any of the minOcc would decrease by current max
            // because then it is worth to use that one and not randomly another

            console.log("Statistics:" + minOcc + ": rest:" + JSON.stringify(ech));

            let found = false;
            for (let mink in edgeCountMap) {

                // ha van olyan kör ami egyetlen élben fordul elő, akkor
                // azt leveszi

                if (edgeCountMap[mink] == 1) {
                    found = true;
                    for (let path of paths) {
                        for (let i = 0; i < path.edges.length; i++) {
                            let k = path.edges[i].v + ":" + path.edges[i].w;
                            if (mink == k) {
                                console.log("Forced selection:" + mink + ":" + JSON.stringify(path.original));
                                found = true;
                                this.removeEdges(graph, path, goodPaths, edgeCountMap);
                            }
                        }
                    }
                }
            }

            if (found) {
                continue;
            }

            // olyan éleket keressük amelyek a legkevesebb körben fordulnak elő, viszont
            // a körből a lehető legtöbb élet ki tudja venni, ez az előnyös választás

            for (let minK in edgeCountMap) {

                if (found) {
                    break;
                }

                if (edgeCountMap[minK] == minOcc) {
                    // this is an edge that is occurring only a few times
                    for (let path of paths) {

                        if (!filter(path.original)) {
                            continue;
                        }

                        let advantageous = false;

                        for (let e of path.edges) {
                            if (minK == e.v + ":" + e.w) {

                                if (max === this.pathEdgeCount(graph, path)) {
                                    advantageous = true;
                                    break;
                                }
                            }
                        }

                        if (advantageous) {
                            console.log("Advantageous selection:" + minK + " " + JSON.stringify(path.original));
                            found = true;
                            this.removeEdges(graph, path, goodPaths, edgeCountMap);
                        }
                    }

                }
            }

            if (found) {
                continue;
            }

            for (let path of paths) {

                if (!filter(path.original)) {
                    continue;
                }

                if (max === this.pathEdgeCount(graph, path)) {
                    found = true;
                    this.removeEdges(graph, path, goodPaths, edgeCountMap);
                }
            }

            if (!found) {
                max--;
            }
        }

        return goodPaths;
    }

    pathEdgeCount(graph, path) {
        return path.edges.filter(edge => graph.hasEdge(edge)).length;
    }

    /**
     * 
     * @param {Graph} graph 
     * @param {Array} path 
     * @param {Array} goodPaths 
     * @param {Object} edgeMap 
     */
    removeEdges(graph, path, goodPaths, edgeMap) {
        path.edges.filter(edge => graph.hasEdge(edge)).forEach(edge => graph.removeEdge(edge));
        goodPaths.push(path.original);
        this.decreaseEdgeCount(edgeMap, path);
    }

    /**
     * 
     * @param {Object} edgeMap 
     * @param {Object} p 
     */
    decreaseEdgeCount(edgeMap, p) {
        for (let edge of p.edges) {
            let k = edge.v + ":" + edge.w;
            delete edgeMap[k];
        }
    }



}