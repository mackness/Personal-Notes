import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';

function todoReducer() {

}

function App() {
    const [ count, setCount ] = useState(0);
    const [ todos,  ] = useReducer()
    useEffect(() => {
        console.log('mounted');
    }, [])
    useEffect(() => {
        console.log('count has been udpated');
    }, [count])
    return (
        <>
            <h1 onClick={() => setCount(count + 1)}>{count}</h1>
            <div>
                {todos.map(todo => <span>{todo.title}</span>)}
            </div>
        </>
    )
}

ReactDOM.render(<App />, document.querySelector('.container'));