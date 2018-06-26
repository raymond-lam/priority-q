[![Build Status](https://travis-ci.org/raymond-lam/es6-priority-queue.svg?branch=master)](https://travis-ci.org/raymond-lam/es6-priority-queue) [![Greenkeeper badge](https://badges.greenkeeper.io/raymond-lam/es6-priority-queue.svg)](https://greenkeeper.io/)

# priority-q

A simple, modern JavaScript implementation of a priority queue data structure class.

In addition to being a useful utility, this implementation serves as a demonstration of a number of features and conveniences that are available in "modern" JavaScript (ECMAScript 2015 and later), including: 
- arrow functions
- classes, including inheritance, static members, and getters
- default parameter values
- destructuring
- `for...of` loops
- generators
- `import` and `export`
- iteration protocol and iterators
- `let` and block scoping
- rest operator
- spread operator
- `Symbol.species`
- template strings

## API

### *constructor*([init[, cmp]])

The constructor takes two optional arguments: `Array` of initial elements, and a comparator function. The constructor will create a priority queue, where the element with the least value is always dequeued, and enqueue each of the given initial elements. The comparator function, which should take two elements as arguments and return 1 if the first element is greater in value, -1 if the second element is greater in value, and 0 they are equal in value, will be used for all comparisons necessary to keep the priority queue in order. The default comparator simply returns 1 or -1 if the first element is `<` or `>` the second element respectively, or 0 otherwise. 

### *iterable protocol*

The priority queue implements an interable protocol wherein the elements of the priority queue are iterated over in sorted order, without removing elements from it, so that one could, for example, use the for-of loop syntax to loop over the a priority queue.

### clear()

Removes all elements from the priority queue. Returns the number of elements removed.

### clone()

Returns a shallow clone of the priority queue, which is to say, returns a new priority queue with the exact same elements and comparator. 

Returns a priority queue which is of the same type as the original priority queue, unless the class's `Symbol.species` static property is overridden, in which case the returned priority queue's type will be as specified by the `Symbol.species` static property.

### concat(value1[, value2[, ...[, valueN]]])

Return a new  `Array` consisting of the elements of the priority queue in sorted order, followed in order by, for each argument, the elements of that argument (if the argument is an `Array`) or the argument itself (if the argument is not an `Array`), not recursing into nested `Array` arguments.

### dequeue()

Removes and returns the element of the priority queue which is least in value (according to the default comparator or the comparator given to the constructor). Simply returns `undefined` if the priority queue is empty.

### enqueue(*elements)

Inserts each given argument into the appropriate place in the priority queue. Returns the resulting number of elements in the priority queue.

### entries()

Returns a new `Iterator` object which iterates over key/value pairs of the priority queue in sorted over, where the key is the element's position in the priority queue.

### every(callback[, thisArg])

Tests whether every element in the priority queue passes the test implemented by the provided testing function `callback`. The context in which the testing function is called is `thisArg`.

The parameters of the testing function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue. The testing function should return `true` if it is satisfied, and `false` otherwise.

### find(callback[, thisArg])

Returns the value of the first element in the priority queue that satisfies the provided testing function `callback`, or `undefined` otherwise. The context in which the testing function is called is `thisArg`.

The parameters of the testing function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue. The testing function should return `true` if it is satisfied, and `false` otherwise.

### findIndex(callback[, thisArg])

Returns the position of the first element in the priority queue that satisfies the provided testing function `callback`, or `-1` otherwise. The context in which the testing function is called is `thisArg`.

The parameters of the testing function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue. The testing function should return `true` if it is satisfied, and `false` otherwise.

### filter(callback[, thisArg])

Creates a new priority queue with all elements that pass the test implemented by the provided functioni `callback`. The context in which the testing function is called is `thisArg`.

Returns a priority queue which is of the same type as the original priority queue, unless the class's `Symbol.species` static property is overridden, in which case the returned priority queue's type will be as specified by the `Symbol.species` static property.

The parameters of the testing function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue. The testing function should return `true` if it is satisfied, and `false` otherwise.

### forEach(callback[, thisArg])

Calls the provided function `callback` once for each element in the priority queue in sorted order. The context in which `callback` is called is `thisArg`.

The parameters of the `callback` function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue.

### includes(searchElement[, fromIndex])

Searches the priority queue for the given `searchElement` and returns `true` if found, `false` otherwise. Optionally specify `fromIndex` to start the search at that position in the priority queue. A negative `fromIndex` will start the search at position `length + fromIndex`.

### indexOf(searchElement[, fromIndex])

Returns the first index at which a given element can be found in the priority queue, or `-1` if it is not present. Optionally specify `fromIndex` to start the search at that position in the priority queue. A negative `fromIndex` will start the search at posiiton `length + fromIndex`.

### join([separator])

Joins the elements of the priority queue in sorted order into a string, in the manner of `Array`'s `join` method.

### lastIndexOf(searchElement[, fromIndex])

Returns the last index at which a given element can be found in the priority queue, or `-1` if it is not present. Optionally specify `fromIndex` to start the backwards search at that position in the priority queue. A negative `fromIndex` will start the backwards search at posiiton `length + fromIndex`.

### length

Integer property which reflects the number of elements in the priority queue.

### map(callback[, thisArg])

Creates a new `Array` with the results of calling the provided function `callback` on every element in the priority queue in sorted order. The context in which `callback` is called is `thisArg`.

The parameters of the callback function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue.

### peek([index])

By default, returns the element of the priority queue which is least in value (according to the default comparator or the comparator given to the constructor) without removing it.

If a positive `index` is specified, returns the element present at that index, or `undefined` if such an element does not exist. If a negative `index` is specified, returns the element present at `length + index`, or `undefined` if such an element does not exist.

### reduce(callback[, initialValue])

Applies the given callback function against an accumulator (which begins as the given inital value) and each element of the priority queue in sorted order to reduce the elements to a single value.

The parameters of the callback function are: the accumulated value previously returned in the last invocation of the callback, or the given `initialValue` if supplied for the first invocation; the current element being processed; the position of the current element in the priority queue; and a reference to the priority queue.

Note that the callback function is applied to all elements of the priority queue that were present at the time of the call to `reduce`, and only those elements, even if the callback function itself adds or removes elements from the priority queue.

### reduceRight(callback[, initialValue])

Applies the given callback function against an accumulator (which begins as the given inital value) and each element of the priority queue in reverse sorted order to reduce the elements to a single value.

The parameters of the callback function are: the accumulated value previously returned in the last invocation of the callback, or the given `initialValue` if supplied for the first invocation; the current element being processed; the position of the current element in the priority queue; and a reference to the priority queue.

Note that the callback function is applied to all elements of the priority queue that were present at the time of the call to `reduce`, and only those elements, even if the callback function itself adds or removes elements from the priority queue.

### slice([begin[, end]])

Returns a shallow copy of a portion of an priority queue into a new priority queue selected from `begin` to `end` (`end` not included). The original priority queue will not be modified.

The default value of `begin` is `0`, and the default value of `end` is the length of the priority queue. If either value is negative, the value of the priority queue's length plus the value is used instead. 

Returns a priority queue which is of the same type as the original priority queue, unless the class's `Symbol.species` static property is overridden, in which case the returned priority queue's type will be as specified by the `Symbol.species` static property.

### some(callback[, thisArg])

Tests whether some element in the priority queue passes the test implemented by the provided testing function `callback`. The context in which the testing function is called is `thisArg`.

The parameters of the testing function are: the current element, the position of the current element in the priority queue, and a reference to the priority queue. The testing function should return `true` if it is satisfied, and `false` otherwise.

### toJSON()

Returns the elements of the priority queue as an `Array` in sorted order, so that `JSON.stringify` when applied to the priority queue returns the JSON string of a sorted array of the priority queue's elements.

### toLocaleString()

Returns the `.toLocaleString()` of an `Array` containing the priority queue's elements in sorted order. 

### toString()

Returns the `.toString()` of an `Array` containing the priority queue's elements in sorted order. 

### values()

Returns a new `Iterator` object that iterates over the elements of the priority queue in sorted order without removing elements from it.

## Author

Raymond Lam (ray@lam-ray.com)

## License

MIT
