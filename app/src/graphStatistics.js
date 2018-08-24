'use strict';

let Graph = require("graphlib").Graph;

module.exports = class GraphStatistics {

    /**
     * 
     * @param {Graph} graph 
     */
    constructor(graph, cycles) {
        this.graph = graph;
        this.cycles = cycles;
    }

    _getCycleGoodness() {
        let graphEdgeCount = this.graph.edgeCount();

        let allCycles = [];

        for (let cycleGroup of this.cycles) {
            allCycles.push(...cycleGroup.data);
        }

        let paths = allCycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        let cyclesEdgesCount = paths.map(path => path.edges.length).reduce((acc, current) => acc + current);

        return {
            graphEdgeCount: graphEdgeCount,
            cyclesEdgeCount: cyclesEdgesCount,
            ratio: cyclesEdgesCount / graphEdgeCount
        }
    }

    /**
     * 
     */
    printCycleGoodness() {

        console.info("\n ======== Goodness statistics ================");

        let cycleGoodness = this._getCycleGoodness(this.cycles);

        console.log("Edge count in graph = " + cycleGoodness.graphEdgeCount);
        console.log("Edge count in cycles = " + cycleGoodness.cyclesEdgeCount);
        console.log("Goodness ratio = " + parseFloat(cycleGoodness.ratio).toFixed(3));
        console.log("Cycles have " + (parseFloat((cycleGoodness.ratio - 1) * 100).toFixed(0)) + " % more edges than the original graph (learning cost)");

        console.info("\n");
    }

    /**
     * 
     */
    printExercises() {

        console.info("\n ======== Exercises ================");

        for (let pathObject of this.cycles) {
            console.log("\n Exercises of " + pathObject.length + " moves: \n");
            let counter = 1;
            for (let path of pathObject.data) {
                console.info(counter++ + ". " + path.join(", "));
            }
        }

        console.info("\n");
    }

}