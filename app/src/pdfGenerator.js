'use strict';

let filePath = require('path')
let fs = require('fs')
let PDFDocument = require('pdfkit')

module.exports = class PdfGenerator {

    /**
     * 
     * @param {Array} nodes 
     * @param {Array} paths 
     */
    constructor(nodes, paths, dataDirectory, outputFile) {
        this.nodes = nodes;
        this.paths = paths;
        this.dataDirectory = dataDirectory;
        this.outputFile = outputFile;
    }

    /**
     * 
     * @param {string} url
     */
    generate(url) {
        console.log("Exporting to pdf...");

        let doc = new PDFDocument({ bufferPages: true, size: 'A4', margin: 50, layout: "landscape" });
        doc.pipe(fs.createWriteStream(this.outputFile));
        doc.fontSize(10);

        // coordinates in points = (72 point per inch)
        // 11.7 inch wide, 8.3 inch tall in landscape mode

        const dpi = 72;

        const nodeHeightInInch = 2;
        const nodeHeightInPoints = nodeHeightInInch * dpi;

        const spaceBetweenRowsInInch = 0.5;
        const spaceBetweenRowsInPoints = spaceBetweenRowsInInch * dpi;

        let row = 0;

        for (let path of this.paths) {

            let columnPosition = 0;
            const columnWidth = doc.page.width / path.length;

            let headers = this._generateHeader(path.length);

            for (let nodeId of path) {

                let node = this._findNodeById(nodeId);

                let imageCoordinate = { x: columnPosition * columnWidth, y: row * (nodeHeightInPoints + spaceBetweenRowsInPoints) };
                let nodeLabelCoordinate = { x: 5 + columnPosition * columnWidth, y: imageCoordinate.y + nodeHeightInPoints + 5 };

                doc.image(filePath.resolve(this.dataDirectory, node.image), imageCoordinate.x, imageCoordinate.y, { fit: [columnWidth, nodeHeightInPoints] });
                doc.rect(imageCoordinate.x, imageCoordinate.y, columnWidth, nodeHeightInPoints).stroke()
                doc.text("(" + headers[columnPosition] + ") " + node.label, nodeLabelCoordinate.x, nodeLabelCoordinate.y, { width: columnWidth });

                columnPosition++;
            }

            row++;

            if (((row + 1) * (nodeHeightInPoints + spaceBetweenRowsInPoints)) > doc.page.height) {
                doc.addPage();
                row = 0;
            }

        }

        doc.flushPages();
        doc.end();
    }

    _generateHeader(length) {

        let data = ["A", "B", "B", "A"];

        let result = [];

        for (let i = 0; i < length; i++) {
            result.push(data[i % data.length]);
        }

        return result;
    }

    _findNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }


}