import * as React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';

enum ActionTypes {
    ADD = 'ADD',
    DELETE = 'DELETE',
    MARK_COMPLETE = 'MARK_COMPLETE',
}

interface TodoType {
    id: number;
    title: string;
    complete: boolean;
}

interface TodoAction {
    type: string;
    payload: any;
}

declare type TodoState = Array<TodoType>;

const INITIAL_STATE: TodoState = [
    {
        id: 1,
        title: 'a new todo',
        complete: false,
    },
    {
        id: 2,
        title: 'another new todo',
        complete: false,
    },
    {
        id: 3,
        title: 'a third new todo',
        complete: false,
    },
];

function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case ActionTypes.ADD:
            return [...state, ...action.payload.todo];
        case ActionTypes.DELETE:
            return state.reduce((acc, todo) => {
                if (todo.id !== action.payload.id) {
                    acc.push(todo);
                }
                return acc;
            }, []);
        case ActionTypes.MARK_COMPLETE:
            return state.map(todo => {
                if (todo.id === action.payload.id) {
                    todo.complete = true;
                }
                return todo;
            });
        default:
            throw new Error(`Action type ${action.type} does not exist`);
    }
}

function Todo({ todo: { title, id }, dispatch }): JSX.Element {
    const [isChecked, setCheckbox] = React.useState(false);
    return (
        <div
            className={css`
                border: solid 1px #000;
            `}
        >
            <p
                className={
                    isChecked
                        ? css`
                              text-decoration: line-through;
                          `
                        : ''
                }
            >
                {title}
            </p>
            <p
                onClick={() =>
                    dispatch({ type: ActionTypes.DELETE, payload: { id } })
                }
            >
                delete
            </p>
            <p>
                <label>mark complete</label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={event => setCheckbox(event.target.checked)}
                />
            </p>
        </div>
    );
}

function App() {
    const [count, setCount] = React.useState(0);
    const [todos, dispatch] = React.useReducer(todoReducer, INITIAL_STATE);
    React.useEffect(() => {
        console.log('mounted');
    }, []);
    React.useEffect(() => {
        console.log('count has been udpated');
    }, [count]);
    return (
        <>
            <h1 onClick={() => setCount(count + 1)}>{count}</h1>
            <div>
                {todos.map((todo: TodoType) => (
                    <Todo todo={todo} key={todo.id} dispatch={dispatch} />
                ))}
            </div>
        </>
    );
}

ReactDOM.render(<App />, document.querySelector('.container'));
