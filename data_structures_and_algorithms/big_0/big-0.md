# Big 0

Consider a scenario where you need to send a large file across the country. Email for FTP would come to mind first for most people. If the file were really large it might be faster to fly across the country to transfer it. If the file were really large it might even make more sense to drive. 

Electronic file transfer has an 0(s) runtime where s is the size of the file. the size of the file has a linear relationship with the time it takes to transfer it. 

Airplane transfer has an 0(1) runtime. It has a constant relationship with the time it takes to transfer the file. In other words the size of the file in this scenario is irrelevant to the runtime.

Other possible / common runtimes are 0(log N), 0(N log N), 0(n), 0(n^2), and 0(2^n) but there is no fixed list of possible runtimes.

### Big 0 and Quicksort

Quicksort picks a pivot element then swaps the values in the array such that elements less than the pivot appear before elements greater than the pivot, this allows for  a partial sort, then it recursively sorts the left and right sides with the same pivot selection approach.

*Best case:*
If all elements are equal the algorithm will traverse through the whole array once, this would be an 0(n) runtime.

*Worst case:*
If we get really unlucky and the pivot is repeatedly the biggest element in the array? This is actually a common case if the pivot is chosen to be the first element in the subarray and the array is sorted in reverse order. In this case the recursion does not divide the array into two almost equal parts it just shrinks the sub-array by one element. This will degenerate performance to 0(n^2) runtime

*Expected case:*
Usually these extreme situations dont' happen sometimes the pivot will be low or high but we don't expect it to happen every time. The standard runtime is 0(N log N).

Discussing the best case runtime is not usually very helpful to discuss since most algorithms in the best case can have a constant runtime. 

### Space Complexity

time is not the only thing that matters in an algo. We might also care about the amount of memory 

Space complexity is a parallel concept to time complexity. If we need to create an array of size n, this will require 0(n) space. If we need a two-dimensional array of size nxn, this will require 0(n^2) space. 

Stack space in recursive calls counts too, For example, code like this would take 0(n) time and 0(n) space 

```ts
function sum(n: number): number {
    if (n < 0) {
        return 0;
    }
    return n + sum(n-1)
}
```

Each call adds a level to the call stack

```ts
sum(4)
    -> sum(3)
        -> sum(2)
            -> sum(1)
                -> sum(0)
```
Each of these calls are added to the stack and take up actual memory.

However, just because you have n calls total does not mean it takes 0(n) space. Consider the below function, which adds adjacent elements between 0 and n:

```ts
function pairSumSequence(n: number): number {
    let sum: number = 0;
    for (let i: number = 0; i < n; i++) {
        sum += pairSum(i, i + i);
    }
    return sum
}

function pairSum(a: number, b: number): number {
    return a + b;
}
```
There will be roughly 0(n) calls to `pairSum`. However, those calls do not exist simultaneously on the call stack, so you only need 0(1) space.

### Drop the Constants
It si very possible for 0(n) code to run faster than 0(1) code for specific inputs. Big 0 just describes the rate of increase or relative rate of increase.

For this reason, we drop the constants in runtime. An algorithm that one might have described as 0(2N) Many people resist doing this, they will see code that has two non nested loops and consider it 0(2N) and think they are being more precise but they are not.

Consider the code

```ts
const min = Int.MAX_VALUE;
const max = Int.MIN_VALUE;
for (let x: number in array: int[]) {
    if (x < min) {
        min = x;
    }
    if (x > max) {
        max = x;
    }
}
```

```ts
const min = Int.MAX_VALUE;
const max = Int.MIN_VALUE;
for (let x: number in array: int[]) {
    if (x < min) {
        min = x
    }
}
for (let x: number in array: int[]) {
    if (x > max) {
        max = x;
    }
}
```

Which one is faster? the first one does one for loop while the second does two, but then the first one has one line of code in the loop while the other has two. 

You could count the number of instructions, then you would have to go to an assembly level and take into account that multiplication requires more instructions than addition, how the compiler would optimize something and all other sorts of details

this would be horrendously complex, so it does not make sense to even start down this road. Big 0 allows us to express how runtime scales. We have to accept that 0(N) doesn't not always mean faster than 0(N^2)

### Drop the Non-Dominant Terms

What do you do with an expression such as 0(n^2 + N) the second N is not exactly constant but it's also not super important.

We already talked about dropping the constants. Therefor 0(N^2 + N^2) would be 0(N^2) If we don't care about that later N^2 term then why do we care about N... we don't.

You should drop the non dominant terms 
* 0(n^2 + N) becomes 0(n^2)
* 0(n + log n) becomes 0(n)
* 0(5*2^n + 10000000^100) becomes 0(2^n)

We might still have a sum in a runtime, For example, the epxression 0(B^2 + A) can not be reduced without some special knowledge of A and B

the following graph depicts the rate of increase for common runtimes:

### Multi-Part Algorithms (add vs. multiply)

understand the difference between the following:

```ts
for (let a: int in arr) {
    print(a)
}

for (let b: int in arr) {
    print(b)
}
```

the runtme for this is 0(a + b)

```ts
for (let a: int in arr) {
    for (let b: int in arr) {
        print(b)
    }
}
```

the runtime for this is 0(a * b)

- If your algorithm is "do this then do that" then you add the runtime
- If your algorithm is "do this and for each do that" then you multiply the runtimes

### Amortized Time
An `ArrayList` or a dynamically resizing array, allows you to have the benefits of an array while offering flexibility in it's size. An `ArrayList` is implemented with an array, when the array hits capacity the `ArrayList` class created a new array of 2N size and copies over N elements.

How would you describe the runtime of this process?

The array could be full if the array contains N elements, then inserting a new element will take 0(N) time. You will have to create a new array of size 2N and then copy N elements over. This insertion will take 0(N) time.

> However, we also know that this does not happen very often. The vast majority of the time insertion will be in 0(1) time.

We need a concept that takes both into account. This is what amortized time does. It allows us to describe that yes the worst case happens every once in a while, but once it happens it won't happen again for so long that the cost is `amortized`

as e insert elements, we double the capacity when the size of the array is a power of 2. So after x elements we double the capacity at array sizes 1,2,4,8,16... that doubling takes, respectively 1,2,4,8,16,32... copies 

what is the sum of 1,2,4,8,16...x ? If you read this sum left to right, then it starts with 1 and doubles until it gets to X. If you read right to left it starts with  and halves until it gets to 1.

What is then the sum of X + x/2 + x/4 + x/8 + ... + 1 this is roughly 2X.

therefore, X insertions take 0(2X) time. the amortized time for each insertion is 0(1).

### Log N Runtimes

We commonly see 0(log N) runtimes. Where does this come from? Let's look at a binary search example. In binary search we are looking for an example X in an N-element sorted array. We first compare x to the midpoint of the array. If x == middle, then we retun x, if x < middle then we search on the left side of the sorted array. If x > middle, then we search on the right side of the sorted array. 

```ts
search 9 within [1,5,8,9,11,,13,15,19,21]
    compare 9 to 11 -> smaller
        search within [1,5,8,9]
        compare 9 to 8 -> bigger
        search within [9]
        compare 9 to 9
        return 
```

We start off with N element array to search. Then, after a single step we're down to n/2 elements. one more step, and we're down to n/4 elemtns. we stop when we either find the value or we're down to just one element.

The total runtime is then a matter of how many steps (dividing N by 2 each time) we can take until N becomes 1

```ts
n = 16
n = 8
n = 4
n = 2
n = 1
```

We could look at this in reverse (going from 1 to 16 instead of 16 to 1) How many times can we multiply 1 by 2 until we get N?

```ts
n = 1
n = 2
n = 4
n = 8
n = 16
```

What is k in the expression 2^k = N? this is exactly what log expresses

```ts
2^4 = 16 -> log16 = 4
log2N = k -> 2^k = N
```

This is a good takeaway for you to have. When you see a problem where the number of elements in the problem space gets halved each time, that will likely be 0(log n) runtime

### Recursive Runtimes

Here is a tricky one, what is the runtime of this code?

```ts
function f(n: number): number {
    if (n <= i) {
        return 1
    }
    return f(n - 1) + f(n - 1);
```

A lot of people see the two calls to f as 0(n^2). This is completely incorrect.

Rather than making assumptions, let's derive the runtime by walking thought the code. Suppose we call f(4). This calls f(3) twice. Each of those calls to f(3) calls f(2), until we get down to f(1)

How many calls in the tree, don't count!

The tree will have a depth N. each node ie function call has two children. therefore, each level will have twice as many calls as the one above it. The number of nodes in each level is:

level | # nodes | Also expressed as... | Or...
------------ | ------------- | ------------- | -------------
0 | 1 | | 2^0
1 | 2 | 2 * previous level = 2 | 2^1
2 | 4 | 2 * previous level = 2 * 2^1 = 2^2 | 2^2
3 | 8 | 2 * previous level = 2 * 2^2 = 2^3 | 2^3
4 | 16 | 2 * previous level = 2 * 2^3 = 2^4 | 2^4

Therefore there will be 2^0 + 2^1 + 2^2 + 2^3 + 2^4 + .... + 2^N (which is 2^n-1) nodes.

Try to remember this pattern when you have a recursive function that makes multiple calls, the runtime might looks something like this 0(branches^depth), where branches is the total number of times each recursive cal branches, in this case 0(2^n)

The space complexity of the algorithm will be 0(N). Although we have 0(2N) nodes in the tree total, only 0(N) exist at any given time. Therefore, we only need to have 0(N) memory available. 

### Examples and Exercises





















