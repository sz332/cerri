'use strict';

let Graph = require("graphlib").Graph;
const express = require('express')

module.exports = class GraphVisualizer {

    /**
     * Visualize the graph by starting a web server
     * @param {Graph} graph 
     * @param {Array} cyclesResult
     * @param {Object} config - The configuration
     * @param {number} config.port - The port where the webserver shall listen
     * @param {string} config.staticDirLocation - The location where the json data will be exported
     * @param {string} config.modulesDirLocation - Node modules directory location
     * @param {string} config.graphLocation - The graph filename location
     */
    constructor(graph, cyclesResult, config) {
        this.graph = graph;
        this.cyclesResult = cyclesResult;
        this.config = config;
    }

    visualize() {
        // write out data into static folder

        // start http server
        const app = express();
        app.use(express.static(this.config.staticDirLocation));
        app.use("/graph.json", express.static(this.config.graphLocation));
        app.use("/node_modules", express.static(this.config.modulesDirLocation));
        app.listen(this.config.port, () => console.log('HTTP server started on port ' + this.config.port + "!"));
    }

}