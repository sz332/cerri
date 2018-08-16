'use strict';

let Graph = require("graphlib").Graph;

module.exports = class GraphParser {

    constructor(graph) {
        this.graph = graph;
    }

    findCycles(maxCycleLength) {
        let result = [];
        
        console.log("Started parsing graph");

        this.graph.nodes().forEach(node => this.cycleRecursive(node, this.graph, [], result, maxCycleLength));
        
        console.log("Starting simplifying the result");
        
        let retValue = this.unique(result).map(function(list) { list.shift(); return list; }).sort(function(a, b) { return a.length - b.length; });
        
        console.log("Finished simplifying the result");
        
        return retValue;
    }

    cycleRecursive(current, graph, path, result, maxCycleLength) {

        // we will skip the too long cycles
        if (path.length > maxCycleLength) {
            return;
        }

        if (path.length > 0) {

            // we found a current, self-returning circle
            if (path[0] === current) {
                
                if (result.length % 1000 === 0){
                    console.info("Found a cycle, path = " + path + " # of cycles = " + result.length);
                }

                path.push(current);
                result.push(path);
                return;
            }

            // we already found a path and a circle, this is not what we want
            if (path.includes(current)) {
                return;
            }
        }

        let outEdges = this.graph.outEdges(current);

        outEdges.forEach(edge => {
            let clonedArray = path.slice(0);
            clonedArray.push(current);
            this.cycleRecursive(edge.w, this.graph, clonedArray, result, maxCycleLength);
        });

    };

    removeDuplicates(input) {
        return input.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        });
    };

    arrayEquals(a, b) {

        if (a.length === b.length) {

            let sortedA = this.removeDuplicates(a.slice(0)).sort();
            let sortedB = this.removeDuplicates(b.slice(0)).sort();

            for (let i = 0; i < sortedA.length; i++) {
                if (sortedA[i] !== sortedB[i]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    };

    unique(list) {

        let result = [];

        list.forEach(item =>{

            let found = false;

            result.forEach(r => {
                if (this.arrayEquals(r, item)) {
                    found = true;
                }
            });

            if (!found) {
                result.push(item);
            }

        });

        return result;
    };

}