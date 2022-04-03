export const bellmanFord = (source, nodes, edges, maxWeight) => {

    let distance = {};
    let previous = {};
    let paths = []
    let result = []

    nodes.forEach(node => {
        distance[node] = Infinity
        previous[node] = null;
    });

    distance[source] = 0;
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = 0; j < edges.length; j++) {
            let u = edges[j].source;
            let v = edges[j].target;
            let weight = edges[j].weight;

            if (distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
                previous[v] = u;
            }
        }
    }

    for (let i = 0; i < edges.length; i++) {
        let u = edges[i].source;
        let v = edges[i].target;
        let weight = edges[i].weight;

        if (distance[u] + weight < distance[v]) {
            console.log('Negative Cycle Detected');
            return;
        }

    }


    // finding paths and push them an array for result
    for (let i = 0; i < nodes.length; i++) {

        let node = nodes[i];
        let path = [];
        while (previous[node]) {
            path.push(node);
            node = previous[node];

        }
        path.push(node);
        paths.push(path);

    }



    // loop through paths and find their weight for our fuel if it is less than maxWeight push it to result

    paths.filter(item => {
        let pathWeight = 0;
        item.reverse().forEach(path => {
            edges.forEach(edge => {
                if (edge.source === path && edge.target === item[item.indexOf(path) + 1]) {
                    pathWeight += edge.weight;
                }
            })
        })

        if (pathWeight <= maxWeight) {
            // add path to result with weight
            result.push({
                item,
                pathWeight
            })

        }
    })


    // sorted result by weight highest to lowest and return it
    result.sort((a, b) => {
        return b.pathWeight - a.pathWeight
    })

    return result[0];

}



// This example is used to find the shortest path from source to target for testing
export const bellmanFordExample = (graph, source) => {

    let distance = {};
    let previous = {};
    let paths = []
    let result = []

    let nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']


    nodes.forEach(node => {
        //int max Value
        distance[node] = Infinity
        previous[node] = null;
    });


    distance['A'] = 0;


    const edges = [{
            source: 'A',
            target: 'B',
            weight: 1
        },
        {
            source: 'A',
            target: 'C',
            weight: 2
        },
        {
            source: 'B',
            target: 'C',
            weight: 4
        },
        {
            source: 'B',
            target: 'D',
            weight: 3
        },
        {
            source: 'C',
            target: 'D',
            weight: 5
        },
        {
            source: 'C',
            target: 'E',
            weight: 2
        },
        {
            source: 'D',
            target: 'E',
            weight: 2
        },
        {
            source: 'D',
            target: 'F',
            weight: 1
        },
        {
            source: 'E',
            target: 'F',
            weight: 6
        },
        {
            source: 'E',
            target: 'G',
            weight: 3
        },
        {
            source: 'F',
            target: 'G',
            weight: 2

        },

    ]



    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = 0; j < edges.length; j++) {
            let u = edges[j].source;
            let v = edges[j].target;
            let weight = edges[j].weight;

            if (distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
                previous[v] = u;

            }
        }
    }

    for (let i = 0; i < edges.length; i++) {
        let u = edges[i].source;
        let v = edges[i].target;
        let weight = edges[i].weight;

        if (distance[u] + weight < distance[v]) {
            console.log('Negative Cycle Detected');
            return;
        }

    }

    console.log('Shortest Paths ');

    for (let i = 0; i < nodes.length; i++) {

        let node = nodes[i];
        let path = [];
        while (previous[node]) {
            path.push(node);
            node = previous[node];

        }
        path.push(node);
        paths.push(path);

    }



    let maxWeight = 6;



    paths.filter(item => {
        let pathWeight = 0;


        item.reverse().forEach(path => {
            edges.forEach(edge => {
                if (edge.source === path[0] && edge.target === item[item.indexOf(path) + 1]) {
                    pathWeight += edge.weight;
                }
            })
        })

        if (pathWeight <= maxWeight) {
            // add path to result with weight
            result.push({
                item,
                pathWeight
            })

        }
    })


    return result.reverse()[0]

}