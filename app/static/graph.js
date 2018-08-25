class GraphVisualizer {

    constructor(graphComponent, tableComponent) {
        this.graphComponent = graphComponent;
        this.tableComponent = tableComponent;
    }

    initGraph(data) {
        console.info("Init graph called");

        this.graphData = this._processData(data);

        this.graphData.edges.forEach(element => {
            element.arrows = "to";
            element.length = 200;
            element.color = { highlight: '#ff0000' };
        });

        this.nodesDataSet = new vis.DataSet(this.graphData.nodes);
        this.edgesDataSet = new vis.DataSet(this.graphData.edges);

        let graph = {
            nodes: this.nodesDataSet,
            edges: this.edgesDataSet
        };

        let options = {
            autoResize: true,
            width: '100wv',
            height: '600px',
            physics: {
                enabled: false
            },
            nodes: {
                borderWidth: 3,
                size: 50,
                color: {
                    border: '#222222',
                    background: '#666666'
                },
                font: {
                    color: 'black'
                }
            }
        };

        this.network = new vis.Network(this.graphComponent, graph, options);
    }

    setCyclesResult(data) {
        console.info("Setting cycles result");
        this.cycles = data.paths;

        for (let pathObject of data.paths) {

            for (let path of pathObject.data) {
                let row = document.createElement('div');
                row._path = path;

                row.className = 'cycle';
                row.innerHTML = path.join(", ");

                let that = this;

                row.addEventListener("click", function() { that._selectPath(this, this._path); });

                this.tableComponent.appendChild(row);
            }
        }
    }

    _selectPath(component, path) {

        let edgeIds = [];

        for (let i = 0; i < path.length; i++) {

            const from = path[i];
            const to = path[(i + 1) % path.length];

            let edgeId = this.edgesDataSet.get().filter(x => x.from === from && x.to === to).map(x => x.id)[0];

            if (edgeId) {
                edgeIds.push(edgeId);
            }
        }

        this.network.selectEdges(edgeIds);
    }

    _processData(newValue) {

        let data = {};

        data.nodes = newValue.nodes;
        data.edges = [];

        for (let item of newValue.edges) {
            for (let toNode of item.toList) {

                if (typeof toNode === 'string' || toNode instanceof String) {
                    data.edges.push({
                        "from": item.from,
                        "to": toNode
                    });
                } else {
                    data.edges.push({
                        "from": item.from,
                        "to": toNode.name
                    });
                }

            }
        }

        return data;
    };

}