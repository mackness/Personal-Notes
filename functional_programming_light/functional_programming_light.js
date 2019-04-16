

const partial = (fn, ...presentArgs) => (...laterArgs) => fn(...presentArgs, ...laterArgs);

function ajax(url, data, callback) {
    callback(data);
}

const getPerson = partial(ajax, 'https://local:3000/api/person');

getPerson({data: 1}, (data) => {
    console.log('called', data)
});