### GraphQL

Why GraphQL, rest does not quite work for modern applications. REST relies on the idea that your use cases are mapped out and finalized before development has begun and makes it very difficult for backend to adapt to changing front end requirements after development has started. GraphQL makes it much easier to backends to adapt to changing front end requirements because a graph is at the center of the architecture allowing for front ends to write flexible queries. Also solves the issue of over fetching data because you can use a flexible query language to get only the information you need an nothing more.

Useful [cheat sheet](https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png)

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
