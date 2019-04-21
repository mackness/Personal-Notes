### GraphQL

Why GraphQL, rest does not quite work for modern applications. REST relies on the idea that your use cases are mapped out and finalized before development has begun and makes it very difficult for backend to adapt to changing front end requirements after development has started. GraphQL makes it much easier to backends to adapt to changing front end requirements because a graph is at the center of the architecture allowing for front ends to write flexible queries. Also solves the issue of over fetching data because you can use a flexible query language to get only the information you need an nothing more.

[PDF cheat sheet](https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png)


[DevHints cheat sheet](https://devhints.io/graphql)

### Root Schemas

Every graph has a root and a root schema is the root of your graph. It defines top level information. Below is a simple example of a root schema:

```ts
type Location {
    lat: Float
    lng: Float
}

type Cat {
    name: String!
    breed: String!
    location: Location
}

type Dog {
    name: String
    breed: String
    friends: [String]
}

type Query {
    myCat: Cat
    myDog: Dog
}

schema {
    query: Query
}
```

The schema defines a top level `Query` property, this is the root of the graph. You can call the top level query object anything as long as the name on line `33` matches the name on line `27`. So at this point if we wanted to setup resolvers for this graph they would look something like this:

```js
const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
        Query: {
            myCat() {
                return {
                    name: 'Squeaker',
                    breed: 'tabby',
                    location: {
                        lat: 32.759,
                        lng: 45.345,
                    },
                };
            },
            myDog() {
                return {
                    name: 'Lola',
                    breed: 'Terrier',
                    friends: ['doug', 'pauly', 'franklin', 'penny'],
                };
            },
        },
    },
    async context({ req }) {
        const user = await authenticate(req);
        return { user };
    },
});
```

We have two main resolvers `myCat` and `myDog` that return some information about the cat and dog in the shape that we specified in our root schema. The interfaces of the object and their values need to match the root schema or GQL will complain. All of of the field values eventually boil down to Scalar Types.

### SDL (Schema Definition Language)

The string in the root schema section above is SDL and a valid GQL schema.

### Scalar and Object Types

Scalar types are built in primitives (String, Int, Float, Boolean, ID). Object types are custom shapes with fields that either scalar types or other object types (aka interfaces). All objects will eventually boil down to a scalar type.

> side note on `Scalar Types` comprise enumeration types, integer types, and real types. Enumeration types and integer types area called discrete types; each value of a discrete type has a position number which is an integer value. Integer types and real types are numeric types. All scalar types are ordered, that is, all relational operators are predefined for their values.

Object type fields also describe any arguments and validations. Validations are asserted with a `!` after the scalar value.

> side note on `extends` vs `implements` a class that extends a parent benefits from inheritance while implements is more related to polymorphism in the sense that if class A implements class B - B is not a child of A rather B just needs to implement A's interface or public API. Said differently; if a method requires A, since B implements A that method can also be satisfied with B.

### Query and Mutation Types

-   Query type describes the queries your API is capable of.
-   A query operation is just a name, with possible arguments that eventually return a type. A query operation is the name of the query / resolver function (`myCat`, `myDog`)
-   Mutation is the exact same thing, but with the intent of updating the database DB vs just reading information.

### Input types

In order to accept arguments you need to use a special type called an `Input Type` The following is an example of an input type:

```ts
input NewProductInput {
  name: String!
  price: Float!
  image: String!
  type: ProductType!
  description: String
  liquidCooled: Boolean
  bikeType: BikeType
  range: String
}
```

Input types are used for mutations when you need update or mutate the DB. InputTypes can be thought of as PUT or POST requests in REST, where the goal of the request is is to update some data.

### Resolvers

What are resolvers? The REST analogy for resolvers are controllers. Controllers talk to the database to get the data to fulfill a request, resolvers fulfill the same purpose. Every query and mutation your schema has must have a resolver that returns the specified type otherwise what the heck do you expect to happen?

The incoming query dictates which resolvers run and in what order. Consider the following example:

```ts
myCat {
    name
}
```

The first resolver that will run is the `myCat` resolver and if there is another resolver for the `name` field then that resolver will run. Resolvers need to return the shape specified by the query OR delegate to another resolver that will. It's possible ot create recursive resolvers so I't important to make sure that the resolvers eventually resolve to some value otherwise the api can hang or break.

Resolvers take a few args by default and we will look at them in the diagram below

```ts
getData(_, args, context, info)
        |   |       |       |
        |   |       |       // info is the ast for the query
        |   |       // context is shared state between all resolvers and is created in server.js, user auth state, shared logic, caching etc
        |   // args are the args that were passed into the resolver by the query
        // an argument that is information passed in by previous resolvers, this will almost always be null at the root level
```

Apollo wraps all resolvers in a try catch block, if an error is thrown inside a resolver the error is caught and sent back to the client without crashing the server process.

OR

`fieldName: (parent, args, context, info) => data;`

`parent`: An object that contains the result returned from the resolver on the parent type
`args`: An object that contains the arguments passed to the field
`context`: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
info: Information about the execution state of the operation which should only be used in advanced cases

### Nested Resolvers

It's possible ot write resolvers for types and fields of types. Consider the following resolver:

root schema

```ts
const rootSchema = `
    type Cat {
      name: String!
      owner: Owner!
      age: Int
    }
    type Owner {
      name: String
      cat: Cat!
    }
    type Query {
      cat(name: String!): Cat!
      owner(name: String!): Owner!
    }
    schema {
      query: Query
    }
  `;
```

resolvers

```ts
{
    resolvers: {
        Query: {
            cat(_, args) {
                return {}
            },
            owner(_, args) {
                return {}
            }
        },
        Cat: {
            name() {
                return 'Squeaker'
            },
            age() {
                return 3
            },
            owner() {
                return {}
            }
        },
        Owner: {
            name() {
                return 'Mack'
            },
            cat() {
                return {}
            }
        }
    }
}
```

query

```
{
    owner(name: "Fred") {
        name
        cat {
            name
        }
    }
}
```

Given the above code what would you expect the result of the query to be? well the result looks like this:

```json
{
    "data": {
        "owner": {
            "name": "Mack",
            "cat": {
                "name": "Squeaker"
            }
        }
    }
}
```

Why? well in this case top level resolvers are delegating to child resolvers. If we consider how `Owner.cat.name` is being resolved first the top level `owner` resolver runs which returns an empty object and since that's supposed to be an owner type it tells GQL to go look up the fields for the `Owner` type. Since the `Owner` type exits it run the Owner type field resolvers that we asked for in the query in this case it's name and cat. Name resolves to a Scalar type so we're done for that field. cat on the other hand resolves to a `Cat` type and the owner.cat resolver returned an empty object so that tells GQL to go look up the `Cat` type resolvers, since the `Cat` type exists and it has resolvers we continue to run the Cat.name resolver since that's what we asked for in the query and that resolves down to a Scalar type so we're done.

### Basics of authenticating a user

The auth logic should live in the [context function](https://github.com/mackness/apollo-tutorial/blob/0276f8d73a558e6b25c91493a64c6543b7574e83/start/server/src/index.js#L14) that is passed to `ApolloClient` constructor as part of the configuration object. That function will run on each request and the object that is reurned by that function is mapped to the context parameter of each resolver function. That's helpful because we can use that information in a resolver function to determine the user's auth state.

With the ApolloClient it's possible to persist the auth token to local storage as well as set the logged in state in the Apollo cache. That work happens [here](https://github.com/mackness/apollo-tutorial/blob/12c61eb030b6cefb6bd40e31569d848d5bee25b6/start/client/src/pages/login.js#L20-L21)

### Write to a local schema

Querying and mutating local data can be done with the client directive:

```ts
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;
```

### Adding virtual fields to server data

It's possible to add `virtual fields` to data that is received back from the server. These fields only exist on the client and are useful for decorating your remote data with local state. In the following example we're going to add an `isInCart` field to the `Launch` type.

To add a virtual field we need to extend the type we want to add the field to in this case it's the `Launch` type.

[src/resolvers.js](https://github.com/mackness/apollo-tutorial/blob/a77d2ebee89b2ba2415ab131c33a65eb7e692257/start/client/src/resolvers.js#L19)
```ts
export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;
```

Then the client side resolver would look like this:

[src/resolvers.js](https://github.com/mackness/apollo-tutorial/blob/a77d2ebee89b2ba2415ab131c33a65eb7e692257/start/client/src/resolvers.js#L25)
```js
export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    },
  },
};
```

we need to specify a client resolver so we can tell Apollo how to resolve the newly added virtual field. In this case we are resolving the data from the client side cache.

### Updating local data

There are two ways to update local data, *direct cache writes* and *client resolvers*. direct writes are generally used for simple primitive values where resolvers are used more more complex updates like adding an object to the end of a list.


### Direct write examples

Here is another [example](https://github.com/mackness/apollo-tutorial/blob/1f27f77e2ef5932ec4015ce0b753446bb0036e7c/start/client/src/containers/logout-button.js#L14) of a direct write when the user clicks the logout button the `isLoggedIn` boolean is written to the local cache. The local storage values are cleared as well to remove the auth token.

[Here](https://github.com/mackness/apollo-tutorial/blob/bcbae43ae6f721d3a9fbe7c041e47d53615ac7bf/start/client/src/containers/book-trips.js#L31) is another example of a local write to the client side cache. In this example after the user has booked a trip the cart items need to be cleared.

### Local resolvers examples

If we want to perform a more complex update we need to use a local resolver. Local resolvers have the same function signature as remote resolvers (`(parent, args, context, info) => data`) the only difference is that the Apollo cache is already added to the context for you. Inside your resolver you will use the cache to read and write data

Let's write the local resolver for the `addOrRemoveFromCart` mutation. You should place this resolver underneath the `Launch` resolver we wrote earlier.

```js
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id],
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    },
  },
```

The above resolver reads the cart items in the cache, filters out the cart item by id if it exists, if it does not exist it adds it to the end of the cart items list and then it writes the new cart items list to the client side cache and returns the new cart items data.