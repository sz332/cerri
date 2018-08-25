class GraphVisualizer {

    constructor(graphComponent) {
        this.graphComponent = graphComponent;
    }

    initGraph(data) {
        console.log("Init graph called");

        let graphData = this._processData(data);

        graphData.edges.forEach(element => {
            element.arrows = "to";
            element.length = 200;
        });

        let graph = {
            nodes: new vis.DataSet(graphData.nodes),
            edges: new vis.DataSet(graphData.edges)
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
            },
            edges: {
                color: 'darkgray'
            }
        };

        this.network = new vis.Network(this.graphComponent, graph, options);
        //this.network.on("select", this._nodeSelected.bind(this));
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