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

```
function sum(n: number): number {
    if (n < 0) {
        return 0;
    }
    return n + sum(n-1)
}
```
Each call adds a level to the call stack
```
sum(4)
    -> sum(3)
        -> sum(2)
            -> sum(1)
                -> sum(0)
```
Each of these calls are added to the stack and take up actual memory.

However, just because you have n calls total does not mean it takes 0(n) space. Consider the below function, which adds adjacent elements between 0 and n:
```
function pairSumSequence(n: number): number {
    let sum: number = 0;
    for (let i: number = 0; i < n; i++) {
        sum += pairSum(i, i + i);
    }
    return sum'
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
```
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

```
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

```
for (let a: int in arr) {
    print(a)
}

for (let b: int in arr) {
    print(b)
}
```
the runtme for this is 0(a + b)

```
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



















