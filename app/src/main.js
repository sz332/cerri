'use strict';

var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");
var GraphStatistics = require("./graphStatistics.js");
var GraphCycleSorter = require("./graphCycleSorter.js");
var AdvantageousMinimizer = require("./minimizers/advantageousMinimizer.js");
var MaxCycleFirstMinimizer = require("./minimizers/maxCycleFirstMinimizer.js");
var NaiveMinimizer = require("./minimizers/naiveMinimizer.js");
var PdfGenerator = require("./pdfGenerator.js");
var path = require('path');

const {
    performance
} = require('perf_hooks');

module.exports = class Main {

    constructor(maxCycleLength, dataDirLocation, graphFileName, exportFileName, minimizer) {
        this.config = {
            maxCycleLength,
            dataDirLocation,
            graphFileName,
            exportFileName,
            minimizer
        };
    }

    _createMinimizer(minimizer) {

        switch (minimizer) {
            case 'naive':
                return new NaiveMinimizer();
                
            case 'maxCycleFirst':
                return new MaxCycleFirstMinimizer();

            case 'advantageous':
                return new AdvantageousMinimizer();

            default:
                return new NaiveMinimizer();
        }

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
        const MINIMIZER = this._createMinimizer(this.config.minimizer);

        // display argument informations

        console.info("Maximum length of the cycle: " + MAX_CYCLE_LENGTH);
        console.info("Data directory: " + DIR_LOCATION);
        console.info("Graph file location: " + GRAPH_LOCATION);
        console.info("Output file location: " + EXPORT_LOCATION);
        console.info("Minimizer algorithm: "  + MINIMIZER.name());

        // Start performance measurement

        let start = performance.now();

        // Load the graph

        let data = new GraphLoader(GRAPH_LOCATION).load();
        let graph = data.graph;

        // Find the cycles
        let cycles = new GraphCycleFinder(graph).findCycles(MAX_CYCLE_LENGTH);

        // Among the cycles find the minimal amount which cover the whole graph using a provided algorithm

        // FIXME this one is not nice yet, need to return remaining edges as well...
        let minimalCycles = new GraphMinimizer(graph, MINIMIZER).minimalCoveringCycles(cycles);

        // Display statistics about the graph
        let statistics = new GraphStatistics(graph, minimalCycles.paths);
        statistics.printExercises();
        statistics.printCycleGoodness();

        // generate pdf
        let generator = new PdfGenerator(data.data.nodes, minimalCycles.paths.map(x => x.data).reduce((a, b) => a.concat(b), []), DIR_LOCATION);
        generator.generate(EXPORT_LOCATION);

        // Display time spent for calculating the result
        let duration = performance.now() - start;
        console.info("Ended in " + (duration / 1000) + " sec");
    }

}