'use strict';

let Graph = require("graphlib").Graph;

module.exports = class GraphStatistics {

    /**
     * 
     * @param {Graph} graph 
     */
    constructor(graph, cyclesResult) {
        this.graph = graph;
        this.cyclesResult = cyclesResult;
    }

    _getCycleGoodness(cycles) {
        let graphEdgeCount = this.graph.edgeCount();

        let allCycles = [];

        for (let cycleGroup of cycles) {
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

        let cycleGoodness = this._getCycleGoodness(this.cyclesResult.paths);

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

        for (let pathObject of this.cyclesResult.paths) {
            console.log("\n Exercises of " + pathObject.length + " moves: \n");
            let counter = 1;
            for (let path of pathObject.data) {
                console.info(counter++ + ". " + path.join(", "));
            }
        }

        if (this.cyclesResult.remainingEdges.length > 0) {

            console.error("\nThe following moves are *not* present in exercises, because they were not part of any cycle:");

            for (let edge of this.cyclesResult.remainingEdges) {
                console.error(edge.v + " -> " + edge.w);
            }
            
            console.error("Try to increase maxCycleLength using the program argument, and restart the application!");
        }

        console.info("\n");
    }

}