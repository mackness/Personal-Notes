# Graphs

A tree is actually a type of graph, but not all graphs are trees. Simply put a tree is a connected graph without cycles.

A graph is simply a collection of nodes with edges between some of them.

Graphs can either be directed (like the following graph) or undirected. While directed edges are like a one way street undirected edges are like a two way street. 

The graph might consist of multiple isolated sub graphs. If there is a path between every pair of vertices. it's called a connected graph

The graph can also have cycles - or not - an asyclic graph is one without cycles, visually you could graph that looks like a cluster of connected nodes.

### Adjacency List

Thi si the most common to represent a graph. Every vertex (or node) stores a list of adjacent vertices. In an undirected graph, an edge like (a,b) would be stored twice: once in a's adjacent vertices and once in b's adjacent vertices 

A simple class definition for a graph node could look essentially the same as a tree node

```ts
class Graph {
    public Node: nodes[]
    this.Node = []
}

class Node {
    public name: string;
    this.name = '';
}
```

You don't necessarily need additional classes to represent a graph. An array (or hash table) of lists or arrays of arrays can store the adjacency list. The graph above could be represented as:

```
0: 1
1: 2
2: 0, 3
3: 2
4: 6
5: 4
6: 5
```

This is a bit more compact, bu it isn't quite as clean. We tend to use node classes unless there's a compelling reason not to.

### Adjacency Matrices

An adjacency matrix (where N is the number of nodes), where a `true` value at `matrix[i][j]` indicates a single edge fro node i to j. you can also use an integer matrix with 0s and 1s 

In an undirected graph, an adjacency matrix will be symmetric. In a directed graph, it will not necessarily be.
