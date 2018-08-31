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
    minimize(graph, newCycles, filter) {

        let max = newCycles.map(x => x.length).reduce((acc, x) => Math.max(acc, x));

        let goodPaths = [];

        let cycles = newCycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        let edgeCountMap = {};

        // calculate the number of every edge used in a cycle

        for (let cycle of newCycles) {
            for (let i = 0; i < cycle.length; i++) {
                let k = cycle[i] + ":" + (i == cycle.length - 1 ? cycle[0] : cycle[i + 1]);

                if (k in edgeCountMap) {
                    edgeCountMap[k]++;
                } else {
                    edgeCountMap[k] = 1;
                }
            }
        }

        while ((graph.edgeCount() > 0) && (max !== 0)) {
            // console.log("Remaining edges:" + graph.edgeCount() + " " + max);

            // mi a minimális száma ennek a hány körben fordul előnek

            let ecc = [];
            let ech = {};

            for (let k in edgeCountMap) {

                const val = edgeCountMap[k];

                if (ecc[val] == undefined) {
                    ecc[val] = 1;
                    ech[val] = 1;
                } else {
                    ecc[val]++;
                    ech[val]++;
                }
            }

            // Calculate minimum occurance

            let minOccurance = ecc.findIndex(x => x !== undefined) || 0;

            // check out if any of the minOcc would decrease by current max
            // because then it is worth to use that one and not randomly another

            // console.log("Statistics:" + minOccurance + ": rest:" + JSON.stringify(ech));

            let found = false;

            for (let min_k in edgeCountMap) {

                // if there is an edge which is only in a single cycle then add this to the list

                if (edgeCountMap[min_k] == 1) {
                    found = true;
                    for (let path of cycles) {
                        for (let i = 0; i < path.edges.length; i++) {
                            let k = path.edges[i].v + ":" + path.edges[i].w;
                            if (min_k == k) {
                                //console.log("Forced selection:" + min_k + ":" + JSON.stringify(path.original));
                                this._removeEdges(graph, path, goodPaths, edgeCountMap);
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

                if (edgeCountMap[minK] == minOccurance) {
                    // this is an edge that is occurring only a few times
                    for (let path of cycles) {

                        if (!filter(path.original)) {
                            continue;
                        }

                        let advantageous = false;

                        for (let e of path.edges) {
                            if (minK == e.v + ":" + e.w) {

                                if (max === this._pathEdgeCount(graph, path)) {
                                    advantageous = true;
                                    break;
                                }
                            }
                        }

                        if (advantageous) {
                            //console.log("Advantageous selection:" + minK + " " + JSON.stringify(path.original));
                            found = true;
                            this._removeEdges(graph, path, goodPaths, edgeCountMap);
                        }
                    }

                }
            }

            if (found) {
                continue;
            }

            for (let cycle of cycles) {

                if (!filter(cycle.original)) {
                    continue;
                }

                if (max === this._pathEdgeCount(graph, cycle)) {
                    found = true;
                    this._removeEdges(graph, cycle, goodPaths, edgeCountMap);
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

    _pathEdgeCount(graph, path) {
        return path.edges.filter(edge => graph.hasEdge(edge)).length;
    }

    /**
     * 
     * @param {Graph} graph 
     * @param {Array} path 
     * @param {Array} goodPaths 
     * @param {Object} edgeMap 
     */
    _removeEdges(graph, path, goodPaths, edgeMap) {
        path.edges.filter(edge => graph.hasEdge(edge)).forEach(edge => graph.removeEdge(edge));
        goodPaths.push(path.original);
        this._decreaseEdgeCount(edgeMap, path);
    }

    /**
     * 
     * @param {Object} edgeMap 
     * @param {Object} p 
     */
    _decreaseEdgeCount(edgeMap, p) {
        for (let edge of p.edges) {
            let k = edge.v + ":" + edge.w;
            delete edgeMap[k];
        }
    }

    name(){
        return "Advantageous minimizer";
    }


}