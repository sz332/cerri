class GraphVisualizer {

    constructor(toolbarComponent, graphComponent, tableComponent, configComponent) {
        this.toolbarComponent = toolbarComponent;
        this.graphComponent = graphComponent;
        this.tableComponent = tableComponent;
        this.configComponent = configComponent;
        this.displayConfigPanel = true;
    }

    /**
     * 
     * @param {*} data 
     */
    initGraph(data) {
        console.info("Init graph called");

        this._createToolbarComponent(this.toolbarComponent);

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
                stabilization: false
            },
            configure: {
                filter: function(option, path) {
                    if (path.indexOf('physics') !== -1) {
                        return true;
                    }
                    if (path.indexOf('smooth') !== -1 || option === 'smooth') {
                        return true;
                    }
                    return false;
                },
                container: this.configComponent
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

    /**
     * 
     * @param {*} data 
     */
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

                row.addEventListener("click", function() { that._selectPath(this._path); });

                this.tableComponent.appendChild(row);
            }
        }
    }

    /**
     * 
     * @param {*} toolbarComponent 
     */
    _createToolbarComponent(toolbarComponent) {
        toolbarComponent.appendChild(this._createResetSelectionButton());
        toolbarComponent.appendChild(this._createReorganizeButton());
    }

    /**
     * 
     */
    _createReorganizeButton() {
        return this._createButton("Configure auto layout", () => {

            this.displayConfigPanel = !this.displayConfigPanel;

            if (this.displayConfigPanel) {
                this.configComponent.style.display = 'block';
                this.graphComponent.style.width = 'calc(100% - 700px)';
            } else {
                this.configComponent.style.display = 'none';
                this.graphComponent.style.width = '100%';
            }

        });
    }

    /**
     * 
     */
    _createResetSelectionButton() {
        return this._createButton("Reset selection", () => {
            this.nodesDataSet.getIds().forEach(nodeId => this.nodesDataSet.update({ id: nodeId, color: { background: "#666666" } }));
            this.edgesDataSet.getIds().forEach(edgeId => this.edgesDataSet.update({ id: edgeId, color: { color: "#838383" } }));
        });
    }

    /**
     * 
     * @param {*} label 
     * @param {*} listener 
     */
    _createButton(label, listener) {
        let button = document.createElement("button");
        let t = document.createTextNode(label);
        button.appendChild(t);
        button.addEventListener("click", listener);
        return button;
    }

    /**
     * 
     * @param {*} path 
     */
    _selectPath(path) {

        this._selectedPath = path;

        const SELECTED_CYCLE_COLOR = "red";

        this.nodesDataSet.getIds().forEach(nodeId => this.nodesDataSet.update({ id: nodeId, color: { background: "#666666" } }));
        this.edgesDataSet.getIds().forEach(edgeId => this.edgesDataSet.update({ id: edgeId, color: { color: "#CCCCCC" } }));

        for (let i = 0; i < path.length; i++) {

            const from = path[i];
            const to = path[(i + 1) % path.length];

            let edgeId = this.edgesDataSet.get().filter(x => x.from === from && x.to === to).map(x => x.id)[0];

            if (edgeId) {
                this.edgesDataSet.update({
                    id: edgeId,
                    color: { color: SELECTED_CYCLE_COLOR },
                    smooth: {
                        enabled: false
                    }
                });
            }

            this.nodesDataSet.update({ id: from, color: { background: SELECTED_CYCLE_COLOR } });
        }

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