'use strict';

let Graph = require("graphlib").Graph;
const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = class GraphVisualizer {

    /**
     * Visualize the graph by starting a web server
     * @param {Object} graphData - The graph data
     * @param {Array} cyclesResult - The cycles to be displayed
     * @param {Object} config - The configuration
     * @param {number} config.port - The port where the webserver shall listen
     * @param {string} config.staticDirLocation - The location where the json data will be exported
     * @param {string} config.modulesDirLocation - Node modules directory location
     * @param {string} config.graphLocation - The graph filename location
     */
    constructor(graphData, cyclesResult, config) {
        this.graphData = graphData;
        this.cyclesResult = cyclesResult;
        this.config = config;
    }

    visualize() {
        // write out data into static folder
        fs.writeFileSync(path.join(this.config.staticDirLocation, 'cyclesResult.json'), JSON.stringify(this.cyclesResult));

        // start http server
        const app = express();
        app.use(express.static(this.config.staticDirLocation));

        app.get("/graph.json", (req, resp, next) => {
            resp.setHeader('Content-Type', 'application/json');
            resp.send(JSON.stringify(this.graphData.data));
        });

        app.use("/node_modules", express.static(this.config.modulesDirLocation));
        app.listen(this.config.port, () => console.log('Access local webserver on  http://localhost:' + this.config.port + ""));
    }

}