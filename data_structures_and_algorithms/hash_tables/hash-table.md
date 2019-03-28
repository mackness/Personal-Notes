# hash tables

> runtime: 0(n) - 0(1)

hash table is a data structure that maps keys to values for highly efficient lookup.

1) the keys hash code needs to be computed. Note that is it possible for two different keys to have the same hash code as there are a finite number of keys and an infinite number of ints.

2) then map the hash code to an index in the array. this can be done with something like `hash(key) % array_length`. Two different hash codes can map to the same index.

3) At this index there is a linked list of keys and values. Store the key and the value in this index. We must use a linked list because of collisions: you could have two different keys with the same hash code, or two different hash codes that map to the same index.

STRING => HASH CODE => INDEX

In order to retrieve a value pair by it's key you have to repeat the process. Compute the hash code by it's key and then compute the index from the hash code then search though the linked list for the value with this key.

the process of storing values in a linked list is called collision chaining. when an index already has a value just crate a list and add the new value to it.

The worst case runtime is 0(n) where n is the number of keys, however good implementations should keep the number of collisions to a minimum in which case the runtime is 0(1)

an alternative approach would be to implement the hash table with a balanced binary search tree. This gives us an 0(log N) lookup time. The advantage to this potentially less space is used since we no longer allocate a large array, we can also iterate though the keys in order which might be useful.

