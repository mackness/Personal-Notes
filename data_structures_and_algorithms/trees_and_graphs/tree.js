

class Node {
    constructor(data) {
        this.left = null;
        this.right = null;
        this.data = data;
    }

    insert(value) {
        if (value < this.data) {
            if (this.left === null) {
                this.left = new Node(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (this.right === null) {
                this.right = new Node(value);
            } else {
                this.right.insert(value);
            }
        }
    }

    contains(value) {
        if (value === this.data) {
            return true;
        } else if (value < this.data) {
            if (this.left === null) {
                return false;
            } else {
                return this.left.contains(value);
            }
        } else {
            if (this.right ===  null) {
                return false;
            } else {
                return this.right.contains(value);
            }
        }
    }

    visit(node) {
        console.log(node.data);
    }

    inOrderTraversal(node) {
        if (node !== null) {
            this.inOrderTraversal(node.left);
            this.visit(node);
            this.inOrderTraversal(node.right);
        }
    }

    preOrderTraversal(node) {
        if (node !== null) {
            this.visit(node)
            this.preOrderTraversal(node.left);
            this.preOrderTraversal(node.right);
        }
    }

    postOrderTraversal(node) {
        if (node !== null) {
            this.postOrderTraversal(node.left);
            this.postOrderTraversal(node.right);
            this.visit(node);
        }
    }
}

let tree = new Node(20);
tree.insert(5);
tree.insert(10);
tree.insert(20);
tree.insert(30);
tree.insert(16);
tree.insert(21);

tree.preOrderTraversal(tree);

// let root = new Node(10);
// root.left = new Node(8);
// root.right = new Node(12);
// root.left.left = new Node(6);
// root.left.right = new Node(7);
// root.right.left = new Node(10);
// root.right.right = new Node(11);

