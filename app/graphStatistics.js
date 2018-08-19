'use strict';

let Graph = require("graphlib").Graph;

module.exports = class GraphStatistics{

    /**
     * 
     * @param {Graph} graph 
     */
    constructor(graph){
        this.graph = graph;
    }

    /**
     * 
     * @param {Array} cycles 
     */
    getCycleGoodness(cycles){
        let graphEdgeCount = this.graph.edgeCount();
        
        let allCycles = [];

        for (let cycleGroup of cycles){
            allCycles.push(...cycleGroup.data);
        }

        let paths = allCycles.map(path => ({ original: path, edges: path.map((node, i, array) => ({ v: node, w: array[(i + 1) % array.length] })) }));

        let cyclesEdgesCount = paths.map(path => path.edges.length).reduce((acc, current) => acc + current);

        return {
            graphEdgeCount : graphEdgeCount,
            cyclesEdgeCount : cyclesEdgesCount,
            ratio : cyclesEdgesCount / graphEdgeCount
        }
    }

}

