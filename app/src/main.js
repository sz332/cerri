'use strict';

var GraphLoader = require("./graphLoader.js");
var GraphCycleFinder = require("./graphCycleFinder.js");
var GraphMinimizer = require("./graphMinimizer.js");
var GraphStatistics = require("./graphStatistics.js");
var AdvantageousMinimizer = require("./minimizers/advantageousMinimizer.js");
var MaxCycleFirstMinimizer = require("./minimizers/maxCycleFirstMinimizer.js");
var NaiveMinimizer = require("./minimizers/naiveMinimizer.js");
var PdfGenerator = require("./pdfGenerator.js");
var GraphVisualizer = require("./graphVisualizer.js");

var path = require('path');

const {
    performance
} = require('perf_hooks');

module.exports = class Main {

    constructor(maxCycleLength, dataDirLocation, graphFileName, exportFileName, minimizer, removeNodes) {
        this.config = {
            maxCycleLength,
            dataDirLocation,
            graphFileName,
            exportFileName,
            minimizer,
            removeNodes
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
        console.info("Minimizer algorithm: " + MINIMIZER.name());

        // Start performance measurement

        let start = performance.now();

        // Load the graph

        let graphData = new GraphLoader(GRAPH_LOCATION).load();
        let graph = graphData.graph;

        if (this.config.removeNodes.length > 0) {
            console.log("Removing nodes from graph: " + this.config.removeNodes);
            this.config.removeNodes.forEach(node => graph.removeNode(node));
            graphData.data.nodes = graphData.data.nodes.filter( x => this.config.removeNodes.indexOf(x.id) === -1 );
        }

        // Find the cycles
        let cycles = new GraphCycleFinder(graph).findCycles(MAX_CYCLE_LENGTH);

        // Among the cycles find the minimal amount which cover the whole graph using a provided algorithm, also get the remaining edges
        let minimalCyclesResult = new GraphMinimizer(graph, MINIMIZER).minimalCoveringCycles(cycles);

        // Display statistics about the graph
        let statistics = new GraphStatistics(graph, minimalCyclesResult);
        statistics.printExercises();
        statistics.printCycleGoodness();

        // generate pdf
        let generator = new PdfGenerator(graphData.data.nodes, minimalCyclesResult.paths.map(x => x.data).reduce((a, b) => a.concat(b), []), DIR_LOCATION);
        generator.generate(EXPORT_LOCATION);

        // Display time spent for calculating the result
        let duration = performance.now() - start;
        console.info("Ended in " + (duration / 1000) + " sec");

        let graphVisualizer = new GraphVisualizer(graphData, minimalCyclesResult, {
            port: 8080,
            staticDirLocation: path.join(__dirname, '..', 'static'),
            modulesDirLocation: path.join(__dirname, '..', 'node_modules'),
            graphLocation: GRAPH_LOCATION
        });

        graphVisualizer.visualize();
    }

}