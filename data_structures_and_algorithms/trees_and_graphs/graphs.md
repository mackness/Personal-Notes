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

The same graph algorithms that are used on adjacency lists (breadth first search ect) cna be performed with adjacency matrices, but they may be somewhat less efficient. In the adjacency list representation, you can easily iterate though the neighbors or a node. In the adjacency matrix representation, you will need to iterate though all the nodes to identify the nodes neighbors. 

### Graph Search

Thw two most common ways to search a graph are depth-first search and breadth first search. 

In depth-first search (DFS), we start at the root or any other arbitrarily selected node and explore each neighbor before going on to any of their children. that is, we go wide before we go deep. 

See the below depiction of a graph and it's depth-first and breadth-first 

[see chapter 4 page 104]

Breadth-first search and depth-first search tend to be used in different scenarios. DFS is often preferred if we want to visit every node in the graph. Both will work just fine, but depth first search is simpler. 

However if we want to find the shortest path between two nodes BFS is generally better. Consider representing all fo the friendships in teh entire world in a graph and trying to find the path of friendships between ash and vanessa. 

in DFS search we could take a path like ash -> brian -> carleton .... and then find ourselves very far away. we could go though most of the world without realizing that, in fact, vanessa is ash's friend. we will still eventually find the path but it may take a long time. we also won't find the shortest path.

in breadth first search, we would stay close to ash for as long as possible. we might iterate through many of ash's friends but we wouldn't go to his more distant connections until absolutely necessary. if vanessa is ash's friend or friend of a friend, we will find out faster than if we were doing depth first search.



