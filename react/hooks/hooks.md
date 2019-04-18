# React Hooks

Hooks let you tap into React features like state withtout using a class component as of `react@16.8.0` in the following react components

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Note that all packages must be 16.8 or higher in order for hooks to work.

Could be a good idea to enable this new lint rule for hooks https://www.npmjs.com/package/eslint-plugin-react-hooks

### Motivation

React makes it difficult to reuse stateful logic between components. Some of the work arounds include higer order components or render props but these patterns require you to change your component implementation to use them wich can be cumbersome. Testing an typing these abstractions can be problematic too. Hooks allow the user to extract stateful logic from your components so it can be tested independently and reused. Hooks allow you to reuse stateful logic without changing your component hierarchy. This approach makes it easy to share hooked functionality with your components or the community.

With class components it can become very easy for lifecycle methods to contain a lot of logic / work that might not be related. This can lead to messy code and inconsistent code which can introduce bugs. To solve this hooks let you split one component into smaller functions based on which pieces are related (such as setting up a subscription or fetching data).

### Testing hooks

A new react api has been released called `ReactTestUtils.act()`. It ensures that the behavior in your tests matches what happens in the browser more closley. It is recommend to wrap any code rendering and triggering updates to your components into `act()` calls. Testing libraries can also wrap their APIs with it, react testing library does this.

a counter example:

`counter.jsx`
```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

*counter.test.jsx*
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

### Using the effect hook

The effect hook allows the user to perform side effects in function components

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. Whether or not you’re used to calling these operations “side effects” (or just “effects”), you’ve likely performed them in your components before.

> use effect hoook can be thought of as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

Sometimes, we want to run some additional code after React has updated the DOM. Network requests, manual DOM mutations, and logging are common examples of effects that don’t require a cleanup. We say that because we can run them and immediately forget about them. Let’s compare how classes and Hooks let us express such side effects.

### Addional Hooks

### `useReducer`
if `useState` is meant for primitive values then `useReducer` is for more complex nested state objects or when the next state depends on the previous state.

Here is a simple coutner useReducer example:

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

### Use Reducer attern side note

Passing down dispatch via context is a great way to avoid passing down callbacks in large component trees. This is a really handy way to fix the callback plumbing problem with large react trees.

*todoApp.js*
```jsx
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside TodosApp can use the dispatch function to pass actions up to TodosApp:

*deepChild.js*
```jsx
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

### End use reducer pattern side note

