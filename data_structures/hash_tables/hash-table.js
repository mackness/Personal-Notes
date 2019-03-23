let hash = require('string-hash');

class HashTable {
  constructor({debug}) {
    this.debug = debug;
    this.list = []
  }

  get(x) {
    let i = hash(x);
    
    if (!this.list[i]) {
        return undefined;
    }

    let result;

    this.list[i].forEach(pairs => {
        if (pairs[0] === x) {
            result = pairs[1];
        }
    });

    if (this.debug) {
        console.log(this.list);
    }

    return result;
  }

  set(x, y) {

    let i = hash(x);

    if (!this.list[i]) {
        this.list[i] = [];
    }

    this.list[i].push([x, y]);
  }
}

const h  = new HashTable({
    debug: true
});

h.set('mack', 'web developer');
h.set('jasmine', 'product person');

