# Functional Programming Light

Why functional programming? The techniques that are designed from the mindset having far more confidence over our programs just by reading them. Someone who understands FP and who's disciplined enough to diligently use it thought their programs will write code that they *and others* can read verify and verify that the program is doing what they want.

Confidence is also increased when se use techniques that avoid or minimize likely source of bugs. that is perhaps the biggest selling point of FP, FP programs have fewer bugs and the bugs that do exist are usually in more obvious places and they are also easier to find an fix. FP code seems to be more bug resistent, certainly not bug proof though.

Over time FP will provide the user with increased code readability. The code will be easier for the author and their team. It's estimated that developers spend most of their time reading code as opposed to writing it so the readability of a code base is extremely important.

### Imperative vs declarative code

Imperative describes the code that most of us probably write naturally; it's focused precisely on instructing the computer how to do something. On the other hand declarative code - the code that we will be learning how to write - is code that is more focused on the what outcome. Declarative code is prone to temp varibales, imperative data flow between functions, reassignments, local and remote mutations, it's possible to grok an imperative program and determine what is happening but it's much harder than declarative one that expresses what is happening in an easier to understand way. 

In FP programs there is not as many explicit conditionals, loops, side effects, reassignments, mutations ect instead there are well-known (to the FP world anyways) trustable patterns like filtering, reduction, transducing, and composition. The focus is shifted from the low level how to the higher what outcomes.




# The nature of functions

functions are at the center of functional programming (big surprise!) but it's not just the `function` keyword that makes code functional; it's how the functions are used.

### What is a function

Function is a collection of code that can be executed one or more times. While this definition is reasonable, it's missing some very important essence that is the core of a function as it applies to FP. So let's dig below the surface to understand functions more completely.

`Arity` is the number of arguments a function takes. So a the definition of a function with arity 3 would look like this `function foo (x, y, z)` and `foo.length === 3`

A function with an `arity` of 1 is known as a `unary`

A fuction with an `arity` of two is called a `binary` 

A function with an `arity` of three or more is called an `n-ary`

