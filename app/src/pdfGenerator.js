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
    constructor(nodes, paths, rootPath) {
        this.nodes = nodes;
        this.paths = paths;
        this.rootPath = rootPath;
    }

    /**
     * 
     * @param {string} url
     */
    generate(url) {
        console.log("Exporting to pdf...");

        let doc = new PDFDocument({ bufferPages: true, size: 'A4', margin: 50, layout: "landscape" });
        doc.pipe(fs.createWriteStream('output.pdf'));

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

            for (let nodeId of path) {

                let node = this._findNodeById(nodeId);

                let imageCoordinate = { x: columnPosition * columnWidth, y: row * (nodeHeightInPoints + spaceBetweenRowsInPoints) };
                let nodeLabelCoordinate = { x: columnPosition * columnWidth, y: imageCoordinate.y + nodeHeightInPoints + 20 };

                doc.image(filePath.resolve(this.rootPath, node.image), imageCoordinate.x, imageCoordinate.y, { fit: [columnWidth, nodeHeightInPoints] });
                doc.rect(imageCoordinate.x, imageCoordinate.y, columnWidth, nodeHeightInPoints).stroke()
                doc.text(node.label, nodeLabelCoordinate.x, nodeLabelCoordinate.y);

                columnPosition++;
            }

            row++;

            if (((row + 1 ) * (nodeHeightInPoints + spaceBetweenRowsInPoints)) > doc.page.height) {
                doc.addPage();
                row = 0;
            }

        }

        doc.flushPages();
        doc.end();
    }

    _findNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }


}