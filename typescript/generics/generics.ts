



function waterfall(callbacks, initialValue) {
    return callbacks.reduce( (accum, cb) => accum.then(cb), Promise.resolve(initialValue));
}

const cb = [
    function(...args) {
        console.log(args);
    },
    function(...args) {
        console.log(args);
    },
    function(...args) {
        console.log(args);
    }
]

waterfall(cb, true);


