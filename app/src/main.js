'use strict';

var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");
var GraphStatistics = require("./graphStatistics.js");
var AdvantageousMinimizer = require("./minimizers/advantageousMinimizer.js");
var PdfGenerator = require("./pdfGenerator.js");
var path = require('path');

const {
    performance
} = require('perf_hooks');

module.exports = class Main {

    constructor(maxCycleLength, dataDirLocation, graphFileName, exportFileName) {
        this.config = {
            maxCycleLength,
            dataDirLocation,
            graphFileName,
            exportFileName
        };
    }

    /**
     * This is the main method of the application
     */
    run() {
        console.info("Starting application...");

        const MAX_CYCLE_LENGTH = this.config.maxCycleLength;
        const DIR_LOCATION = path.resolve(this.config.dataDirLocation);
        const GRAPH_LOCATION = path.resolve(this.config.dataDirLocation, this.config.graphFileName);
        const EXPORT_LOCATION = path.resolve(this.config.exportFileName);

        // display argument informations

        console.info("Maximum length of the cycle: " + MAX_CYCLE_LENGTH);
        console.info("Data directory: " + DIR_LOCATION);
        console.info("Graph file location: " + GRAPH_LOCATION);
        console.info("Output file location: " + EXPORT_LOCATION);

        // Start performance measurement

        let start = performance.now();

        // Load the graph

        let data = new GraphLoader(GRAPH_LOCATION).load();
        let graph = data.graph;

        // Find the cycles

        let cycles = new GraphCycleFinder(graph).findCycles(MAX_CYCLE_LENGTH);

        // Among the cycles find the minimal amount which cover the whole graph using a provided algorithm

        let minimalCycles = new GraphMinimizer(graph, new AdvantageousMinimizer()).minimalCoveringCycles(cycles);

        // Display end result

        let duration = performance.now() - start;

        for (let pathObject of minimalCycles.paths) {
            console.log("\n Exercises of " + pathObject.length + " moves: \n");

            let counter = 1;

            for (let path of pathObject.data) {
                console.info(counter++ + ". " + path.join(", "));
            }
        }

        // Display statistics about the graph

        let cycleGoodness = new GraphStatistics(graph).getCycleGoodness(minimalCycles.paths);

        console.log("Edge count in graph = " + cycleGoodness.graphEdgeCount);
        console.log("Edge count in cycles = " + cycleGoodness.cyclesEdgeCount);
        console.log("Goodness ratio = " + parseFloat(cycleGoodness.ratio).toFixed(3));
        console.log("Cycles have " + (parseFloat((cycleGoodness.ratio - 1) * 100).toFixed(0)) + " % more edges than the original graph (learning cost)");

        // generate pdf
        let generator = new PdfGenerator(data.data.nodes, minimalCycles.paths.map(x => x.data).reduce((a, b) => a.concat(b), []), DIR_LOCATION, EXPORT_LOCATION);
        generator.generate("output.pdf");

        // Display time spent for calculating the result
        console.info("Ended in " + (duration / 1000) + " sec");
    }

}