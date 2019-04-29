# Mocking fundamentals

If you are writing a test that includes a module that needs to be mocked, like a module that makes a network request or runs some non-deterministic code there are multiple options to make that happen:

### Monkey patching

Monkey patching is the practice of overwriting a module with a mock module in a test file so that the test uses the mocked module instead of the original module when it runs. An example:

```js
const assert = require('assert');
const thumbWar = require('../thumb-war');
const utils = require('../utils');

const originalWinner = utils.getWinner;
utils.getWinner = (p1, p2) => p1; // monkey patched module

const winner = thumbWar('kent c dodds', 'ken wheeler');
assert.strictEqual(winner, 'kent c dodds');

utils.getWinner = originalWinner; // clean up after the test
```

It's important to clean up after the test to make sure other tests that run later do not use the monkey patched version of the module.

### Jest.fn

Jest.fn accepts a function that it will create a mock implementation for. We can then make assertions about the mock implementation of the function like how many times it has been called, with what arguments and what it returned:

```js
utils.getWinner = jest.fn((p1, p2) => p1);

const winner = thumbWar('kent c dodds', 'ken wheeler');
expect(winner).toBe('kent c dodds');
expect(utils.getWinner).toHaveBeenCalledTimes(2);
expect(utils.getWinner).toHaveBeenCalledWith('kent c dodds', 'ken wheeler');
expect(utils.getWinner.mock.calls).deepStrictEquals([
    ['kent c dodds', 'ken wheeler'],
    ['kent c dodds', 'ken wheeler'],
]);
expect(utils.getWinner).toHaveBeenNthCalledWith(
    1,
    'kent c dodds',
    'ken wheeler'
);
expect(utils.getWinner).toHaveBeenNthCalledWith(
    1,
    'kent c dodds',
    'ken wheeler'
);
```

If we wanted to implement `fn` ourselves we could do so:

```js
function fn(impl) {
    const mockFn = (...args) => {
        mockFn.mock.calls.push(args);
        return impl(...args);
    };
    mockFn.mock = { calls: [] };
    return mockFn;
}
```

### `Jest.spyOn`

spy on allows us to create an empty mock implementation of a function and at the end of the test call `.mockRestore` on the mock implementation to rest it back to the original function. Here's an example:
We can also call mock implementation to pass our own implementation to set as the mock if we are using `jest.spyOn`.

```js
const thumbWar = require('../thumb-war');
const utils = require('../utils');

test('returns winner', () => {
    jest.spyOn(utils, 'getWinner');
    utils.getWinner.mockImplementation((p1, p2) => p1);

    const winner = thumbWar('ken wheeler', 'kent c dodds');

    expect(winner).toBe('kent c dodds');

    expect(utils.getWinner.mock.calls).toEqual([
        ['kent c dodds', 'ken wheeler'],
        ['kent c dodds', 'ken wheeler'],
    ]);

    utils.getWinner.mockRestore();
});
```

### `Jest.mock`

Jest.mock api will allow you to mock the entire module without monkey patching it in the test file either directly or with `jest.fn`, `jest.spyOn`. It is useful to use this approach with esmodule syntax as monkey patching will not work. Here is an example:

```js
const thumbWar = require('../thumb-war');
const utils = require('../utils');

jest.mock('../utils', () => {
    return {
        getWinner,
    };
});
```

Keep in mind that jest will hoist the mock call to the top of the file so that it runs before any of our require statements are executed. It's also possible to externalize your mocked modules with a `__mocks__` directory. With that approach all you need to do is create that mocks directory next to the module that needs to be mocked and in the test all you need to add
is this line

```js
jest.mock('../utils');
```

and jest will use the module in the `__mocks__` directory as opposed to the original module.
