'use strict';

module.exports = class RemainingFinder {

    /**
     * 
     * @param {Array} cycles The cycles among we searched
     * @param {Array} remainingEdges The remaining edges in a format of [{v, w}, ...]
     */
    constructor(cycles, remainingEdges) {
        this.cycles = cycles;
        this.remainingEdges = remainingEdges;
    }

    /**
     * It may happen that because of some reasons an edge is not found in any cycle. It might happen
     * that there is an error in the code, or that the edge is only part of a longer cycle (which is
     * greater than maximum cycle length)
     */
    print() {
        if (this.remainingEdges.length > 0) {
            console.error("Oooops, could not remove every edge. Trying to find which one, and advice some solutions...");

            for (let edge of this.remainingEdges) {
                console.error("Not removable edge: " + edge.v + " -> " + edge.w + " , searching among the existing cycles.");

                let validCycles = this._findEdgeInCycles(this.cycles, edge);

                if (validCycles.length === 0) {
                    console.error("No cycle contains this edge. This might be normal, try to increase maxCycleLength using the program argument!");
                } else {
                    console.error("!!Bug in the code!!, we found " + validCycles.length + " cycles containing the edge, these are the following");
                    validCycles.forEach(path => console.error(path));
                }
            }
        }
    }

    /**
     * FIXME this part of code shall be moved to a separate class
     * 
     * Find the edge in the cycles, and return the cycles containing the edge
     * @param {Array} cycles 
     * @param {Object} edge 
     */
    _findEdgeInCycles(cycles, edge) {

        let validCycles = [];

        for (let cycle of cycles) {
            for (let i = 0; i < cycle.length; i++) {
                let v = cycle[i];
                let w = cycle[(i + 1) % cycle.length];

                if (v === edge.v && w == edge.w) {
                    validCycles.push(cycle);
                }
            }
        }

        return validCycles;
    }



}