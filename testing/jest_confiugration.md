# Configure Jest

It's important to note that Jest will automatically set `process.env.NODE_ENV === test`. Jest will automatically pickup a `.babelrc` if it finds one at the root of the project. The only thing we need to make sure of is that our babel config works in node.

Jest uses the js-dom module under the hood to mock out a browser env in tests. It's a good idea to keep this enabled if you're testing client side code but if you're testing code that should only run in node it does not make as much sense as there is a slight perf hit to setting up js-dom. We can disable that setup by passing `npx jest -- --env=node` flag to Jest. This tells jest to run the test in a node env skipping the js-dom setup.

Alternatively we can add a `jest.config.js` file at the root of our project and jest will pick this up automatically.

```js
module.exports = {
    testEnvironment: 'jest-environment-node' | 'jest-environment-jsdom',
};
```

This accomplishes the same thing as passing a CLI flag to Jest.

### Support for importing css files

If you import a css file into a react component jest will have no idea how to parse that module so we need to add some configuration to tell jest how to handle it. So in our jest config we can add the following code:

```js
module.exports = {
    moduleNameMapper: {
        '\\.css$': require.resolve('./test/style-mock.js'),
    },
};
```

We are telling jest that for files that end in .css don't try to parse the contents, instead use the module we provide. This is not limited to css file we can do this with any kind of file weather it's a gql schema definition file or an svg, ect.

### Jest Snapshots

Simple snapshot test will look like this

```js
import { getFlyingSuperHeros } from '../super-heros';

test('returns super heros that can fly', () => {
    const flyingHeros = getFlyingSuperHeros();
    expect(flyingHeros).toMatchSnapshot();
});
```

The above test will generate a `__snapshots__` directory with the serialized representation of the object and each time the test is run jest will take another snapshot and compare that with the reference snapshot int he `__snapshots__` directory if they don't match the test will fail.

Snapshots are useful for verifying the structure of objects and components.

Something specific to react testing library. The first child of the container will always be a div so if you want to exclude that from the test it might be a good idea to do this

```js
it('renders the test container with an outer div', () => {
    const { container } = render(<Component>);
    expect(container.firstChild).toMatchSnapshot();
})
```

### Testing components that use emotion

It's possible to write custom serializer for jest snapshots. Emotion already has a custom serializer called `jest-emotion`. This will replace the serialized class name that is created by the emotion babel plugin with the original css which will be more useful when reviewing snapshots.

All we have to do is import the custom serializer in the test and use the jset api to register it like so:

```js
import { render } from 'react-testing-library';
import { createSerializer } from 'jest-emotion';
import * as emotion from 'emotion';
import Component from './component';

expect.addSnapshotSerializer(createSerializer(emotion));

test('mounts', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toMatchSnapshot();
});
```

Note that some snapshotSerializer don't require you to create the serializer in code. With those you can simply defined them in your jest config like so:

```js
{
    snapshotSerializers: ['package-name', 'jest-emotion'];
}
```

### Handling dynamic imports in jest tests

If you are dynamically importing module in a component the webpack runtime has code that is responsible for loading that component, however jest does not know how to handle that so we need to add a babel transform that can handle that for us in test code. For this we can use `babel-plugin-dynamic-import-node`.

to conditionally add this in a test we can add the following code to our `babel.config.js`

```js
{
    ...
    plugins: [
        ...
        isTest: ? 'babel-plugin-dynamic-import-node' : null
    ].filter(Boolean)
}
```

### Setup a global after / before each test hook

This is useful if you have code that you want to execute after each test runs. It's better to keep all of the code in one file that gets executed after each test as opposed to in each test file which would be really repetitive.

We can do this work in the jest configuration file

```js
{
    // array of files that will run before jest is loaded
    setupFiles: [require.resolve('../../setup-tests.js')];
    // a path to a file that should be loaded after jest has been setup
    setupTestFrameworkScriptFile: require.resolve('../../setup-tests.js');
}
```

setup files are files that can be loaded before the jest framework has been setup, on the other hand setupTestFrameworkScriptFiles is a path to a file that should be loaded after jest has been setup because it as references to the jest api like `afterEach` ect.

now tests do not need to have the repetitive setup config inside each one because jest is automatically loading the setup-test file for us before each test and after jest is fully loaded.

### Support custom module resolution with Jest moduleDirectories

It's possible to setup custom module resolution with webpack. In webpack config we can passa a
