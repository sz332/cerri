'use strict';

module.exports = class PdfGenerator {

    /**
     * 
     * @param {Array} nodes 
     * @param {Array} paths 
     */
    constructor(nodes, paths) {
        this.nodes = nodes;
        this.paths = paths;
    }

    /**
     * 
     * @param {string} url
     */
    generate(url) {
        console.log("Exporting to pdf");
    }


}