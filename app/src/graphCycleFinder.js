'use strict';

let Graph = require("graphlib").Graph;

const {
    performance
} = require('perf_hooks');

module.exports = class GraphCycleFinder {

    constructor(graph) {
        this.graph = graph;
    }

    findCycles(maxCycleLength) {
        let result = [];

        this.paths = {};

        console.log("Started parsing graph");

        this.graph.nodes().forEach(node => this.cycleRecursive(node, this.graph, [], result, maxCycleLength));

        console.log("Starting simplifying the result " + result.length + " cycles found");

        let retValue = this.unique(result);

        console.log("Changing order");

        retValue = retValue.map(function(list) { list.shift(); return list; });

        console.log("Sorting cycles by length");

        retValue.sort(function(a, b) { return a.length - b.length; });

        console.log("Finished simplifying the result " + retValue.length);

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

                if (result.length % 1000 === 0) {
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

    getPathKey(path) {
        return path.sort().join(":");
    }
    
    removeDuplicates(input) {
        return input.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        });
    };

    orderArray(array) {
        return this.removeDuplicates(array.slice(0)).sort();
    }

    arrayEquals(a, b) {

        if (a.length === b.length) {

            let sortedA = a;
            let sortedB = this.orderArray(b);

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

        let counter = 0;

        let start = performance.now();

        for (let item of list) {

            if (counter++ % 5000 === 0) {

                let duration = performance.now() - start;

                let remaining = (((((list.length - counter) / 5000) * duration) / 1000) / 60).toFixed(1);

                console.info("Working on item " + counter + " of " + list.length + " [" + duration.toFixed(0) + "] msec, finishing in ~" + remaining + " minutes");

                start = performance.now();
            }

            let found = false;

            for (let r of result) {
                if (this.arrayEquals(r.sorted, item)) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                result.push({
                    original: item,
                    sorted: this.orderArray(item)
                });
            }

        };

        return result.map(x => x.original);
    }

}