'use strict';

let fs = require("fs")
let PDFDocument = require("pdfkit")

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

        let doc = new PDFDocument({bufferPages: true});
        doc.pipe(fs.createWriteStream('output.pdf'));

        doc.text("Hello world", 50, 50);
        
        doc.flushPages();
        doc.end();
    }


}