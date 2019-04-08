### Generics

Generics are parameterized types like functions parameterize values.

```ts
function wrappedValue(x) {
    return {
        prop: x
    }
}
```

In the above example the parameter is going to determine the return type of the function. Whatever will provide to the function as an argument will constitute the value of the property `value`.

We can create a type that will take a value as a type parameter

```ts
interface WrappedValue<T = any> {
    value: T
}

let val: WrappedValue<string[]> = { value: [] };
```

Common convention is to ues capital letters (T, U, V, S, R) which is a carry over from C++ which uses template parameters which is identical to generics.

```ts
interface FilterFunction<T = any> {
    (val: T): boolean;
}

const stringFilter: FilterFunction<string> = val => typeof val === 'string'
```

A more complex practical example related to a promise that has a timeout

```ts
function resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>(() => {
        // start the timeout, reject when it triggers
        const task = setTimeout(() => reject('time up'), timeout);

        promise.then((val) => {
            // clear the timeout
            clearTimeout(task);

            // resolve with the new value
            resolve(val);
        });
    });
}
```

Type parameters can have constrains

```ts
function arrayToDict<T extends { id: string }>(array: T[]):  { [k: string]: T } {
    const out: { [k: string]: T } = {};
    array.forEach(val => {
        out[val.id] = val;
    });
    return out;
}
```

`T extends {id: string}` is like saying type T will be at LEAST an object with the property id that is a string.

Like function parameters type parameters are scoped

```ts
function startTuple<T>(a: T) {
    return function finishTuple<U>(b: U) {
        return [a, b] as [T, U];
    }
}
const myTuple = startTuple(['first'])(42);
```

Just like function parameters type parameters are scoped. In the above example the parameter `b` can not be accessed on line 71.5, similarly the type U can't either.

### When is it a good idea to use a generic?

```ts
interface Shape {
    draw();
}

interface Circle extends Shape {
    radius: number;
}

// implementation #1 that takes a generic that extends shape
function drawShapes1<S extends Shape>(shapes: S[]) {
    shapes.forEach(s => s.draw());
}

// a simpler implementation that does not take a generic
function drawShapes2(shapes: Shape[]) {
    shapes.forEach(s => s.draw());
}
```

Generics are good for relating two things, a function may take in an array of T `[]T` and return a dictionary of `T`, the generic is the thing that relates to ties those two things together.
