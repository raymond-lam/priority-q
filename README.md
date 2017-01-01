![build status](https://travis-ci.org/raymond-lam/es6-priority-queue.svg?branch=master)

# priority-queue.js

A simple ECMAScript 6 implementation of a priority queue data structure class.

In addition to being a useful utility, this implementation serves as a demonstration of a number of features and conveniences that are new to the sixth version of ECMAScript (JavaScript).
 
## Usage

To install: `npm install @raymond-lam/priority-queue`

The priority queue class is made available as module defined in the [UMD](https://github.com/umdjs/umd) format. When in the context of neither AMD nor CommonJS, the module will exist in the global namespace as `PriorityQueue`. 

### AMD
    
    require(['priority-queue'], function(PriorityQueue) {
      let pq = new PriorityQueue([1, 2, 3, 4]);
    });

### CommonJS

    let PriorityQueue = require('@raymond-lam/priority-queue');
    let pq = new PriorityQueue([1, 2, 3, 4]);

### Global

    let pq = new PriorityQueue([1, 2, 3, 4]);

## API

### *constructor*([init], [cmp])

The constructor takes two optional arguments: Array of initial elements, and a comparator function. iThe constructor will create a priority queue, where the element with the least value is always dequeued, and enqueue each of the given initial elements. The comparator function, which should take two elements as arguments and return 1 if the first element is greater in value, -1 if the second element is greater in value, and 0 they are equal in value, will be used for all comparisons necessary to keep the priority queue in order. The default comparator simply returns 1 or -1 if the first element is `<` or `>` the second element respectively, or 0 otherwise. 

### *iterable protocol*

The priority queue implements an interable protocol wherein elements are successively dequeued from a shallow clone of the priority queue, so that one could, for example, iterate over the elements of the priority queue in sorted order using a `for ... of` loop, and the priority queue itself will not be mutated.

### clone()

Returns a shallow clone of the priority queue, which is to say, returns a new priority queue with the exact same elements and comparator.

### dequeue()

Removes and returns the element of the priority queue which is least in value (according to the default comparator or the comparator given to the constructor). Simply returns `undefined` if the priority queue is empty.

### enqueue(*elements)

Inserts each given argument into the appropriate place in the priority queue. Returns the resulting number of elements in the priority queue.

### length

Integer property which reflects the number of elements in the priority queue.

### peek()

Returns the element of the priority queue which is least in value (according to the default comparator or the comparator given to the constructor) without removing it.

### toJSON()

Returns the elements of the priority queue as an Array in sorted order, so that `JSON.stringify` when applied to the priority queue returns the JSON string of a sorted array of the priority queue's elements.

### toLocaleString()

Returns the `.toLocaleString()` of an Array containing the priority queue's elements in sorted order. 

### toString()

Returns the `.toString()` of an Array containing the priority queue's elements in sorted order. 

## Author

Raymond Lam (ray@lam-ray.com)

## License

MIT
