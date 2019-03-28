class Node {
    constructor(value, next, prev) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class LinkedList {
    constructor(node) {
        this.head = null;
        this.tail = null;
        this.node = node;
    }

    addToHead(value) {
        const node = new Node(value, this.head, null);
        if (this.head) {
            this.head.prev = node;
        } else {
            this.tail = node;
        }
        this.head = node;
    }

    addToTail(value) {
        const node = new Node(value, null, this.tail);
        if (this.tail) {
            this.tail.next = node;
        } else {
            this.head = node;
        }
        this.tail = node;
    }

    removeHead() {
        if (!this.head) {
            return null
        }

        let value = this.head.value;
        this.head = this.head.next;

        if (this.head) {
            this.head.prev = null;
        } else {
            this.tail = null;
        }

        return value;
    }

    removeTail() {
        if (!this.tail) {
            return null
        }

        let value = this.tail.value;
        this.tail = this.tail.prev;

        if (this.tail) {
            this.tail.next = null
        } else {
            this.head = null;
        }

        return value;
    }

    search(value) {
        let current = this.head;

        while (current) {
            if (current.value = value) {
                return current
            }
            current = current.next;
        }
        return null;
    }
}

const l = new LinkedList();

l.addToHead(1);
l.addToTail(2);

console.log(l.search(1));
console.log(l.search(2));
console.log(l.search(3000));
