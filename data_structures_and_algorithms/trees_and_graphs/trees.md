### Trees

A tree is a data structure that is composed of nodes

* Each tree has a root node
* The root node has 0 or more child nodes
* Each child node has 0 or more child nodes and so on

The tree can not contain cycles. The nodes may or may not be in a particular order, they could have any data type as values, they may or may not have links back to their parent nodes

a very simple class definition for a node is

```ts
class Node {
    public name: string
    public children: Node[]
    this.name = '';
    this.children = [];
}
```

You might also have a Tree class to wrap this node. For the purposes of interview questions, we typically do not use a Tree class you can feel free if it makes your code simpler or better but it rarely does.

```ts
class Tree {
    public root: Node;
    this.root = Node;
}
```

Tree and graph questions are rife with ambiguous details and incorrect assumptions. Be sure to watch out for the following issues and seek clarification when necessary.

### Trees vs. Binary Trees

A binary tree is a tree in which each node has up to two children. Not all trees are binary trees. For example the following tree would be considered a ternary tree:

```
      O
    / | \
   0  0  0
 /  \     \
0    0     0
```

A tree that represents a phone book might be a 10-ary tree in which each node representing a phone number might have UP TO 10 children (one for each digit)

A node is called  leaf if it has no children

### Binary Tree vs. Binary Search Tree

A binary search tree is a binary tree in which every node fits a specific ordering property:

All left descendents <= n < all right descendents 

keep in mind that n is the current node

also keep in mid this must be true for all node descendents and not just immediate children. The following tree on the left below is a binary search tree, the tree on the right is not since 12 is not on the left of 8

BST
```
      8
    /   \
   4    10
 /  \     \
2    6     20
```

NOT BST
```
      8
    /   \
   4     10
 /   \     \
2    12    20
```

when given a question, many candidates assume the interviewer means a binary search tree. be sure to ask a binary search tree imposes the condition that, for each node, it's left descendents are less than or equal to the current node, which is less than the right descendents

### Balanced vs. Unbalanced

While many trees are balanced, not all are. Ask your interviewer for clarification here. Note that balancing a tree does not mean the left and right subtrees are exactly the same size.

one way to think about a balanced tree is a tree that still supports insertion and finds in 0(log N) time

there is a difference between complete and incomplete binary trees, if a tree has a node that has a right sibling but not a left sibling it is considered a partial binary tree and is not complete. 

A perfect binary tree is one that is full and complete.

### Binary Tree Traversal

in order traversal means to visit - often print - the lft branch, then the current node, and finally the right branch.

```ts
function inOrderTraversal(TreeNode, Node) {
    if (node !== null) {
        inOrderTraversal(node.left);
        visit(node);
        inOrderTraversal(node.right)
    }
}
```

pre order traversal, visit the current node before it's child nodes 

```ts
function preOrderTraversal(TreeNode, Node) {
    if (node !== null) {
        visit(node);
        preOrderTraversal(node.left);
        preOrderTraversal(node.right);
    }
}
```

post order traversal post order traversal visits the current node after it's child nodes - so the root is the last node visited

```ts
function postOrderTraversal(TreeNode, Node) {
    if (node !== null) {
        postOrderTraversal(node.left);
        postOrderTraversal(node.right);
        visit(node);
    }
}
```






