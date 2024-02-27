type Edge = {
  source: string;
  target: string;
  weight: number;
};

type PathResult = {
  item: string[];
  pathWeight: number;
};

export const bellmanFord = (
  source: string,
  nodes: string[],
  edges: Edge[],
  maxWeight: number
): PathResult | undefined => {
  let distance: { [key: string]: number } = {};
  let previous: { [key: string]: string | null } = {};
  let paths: string[][] = [];
  let result: PathResult[] = [];

  nodes.forEach((node) => {
    distance[node] = Infinity;
    previous[node] = null;
  });

  distance[source] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.forEach(({ source: u, target: v, weight }) => {
      if (distance[u] + weight < distance[v]) {
        distance[v] = distance[u] + weight;
        previous[v] = u;
      }
    });
  }

  edges.forEach(({ source: u, target: v, weight }) => {
    if (distance[u] + weight < distance[v]) {
      console.log("Negative Cycle Detected");
      return;
    }
  });

  nodes.forEach((node) => {
    let path: string[] = [];
    while (previous[node]) {
      path.push(node);
      node = previous[node]!;
    }
    path.push(node);
    paths.push(path);
  });

  paths.filter((item) => {
    let pathWeight = 0;
    item.reverse().forEach((path) => {
      edges.forEach((edge) => {
        if (
          edge.source === path &&
          edge.target === item[item.indexOf(path) + 1]
        ) {
          pathWeight += edge.weight;
        }
      });
    });

    if (pathWeight <= maxWeight) {
      result.push({
        item,
        pathWeight,
      });
    }
  });

  result.sort((a, b) => b.pathWeight - a.pathWeight);

  return result[0];
};
