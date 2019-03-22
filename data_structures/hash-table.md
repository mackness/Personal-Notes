# hash tables

> rumtime: 0(n) - 0(1)

hash table is a data structure that maps keys to values for highly efficent lookup.

1) the keys hash code needs to be computed. Note that is it possible for two different keys to have the same hash code as there are a finite number of keys and an infinite number of ints.

2) then map the hash code to an index in the array. thsi can be done with someting like `hash(key) % array_length`. Two differnt hash codes can map to the same index.

3) At this index there is a linked list of keys and values. Store the key and the value in this index. We must use a linked list becuase of collisions: you could have two differnt keys with the same hash code, or two different hash codes that map to the same index.

In order to retrieve a value pair by it's key you have to repeat the process. Compute the hash code by it's key and then compute the index from the hash code then search though the linked list for the value with this key.

The worst case runtime is 0(n) becuase if the number of collisions is very high 

