'use strict';

//     priority-q 3.0.1
//     https://github.com/raymond-lam/priority-q
//     (c) 2018 Raymond Lam
//
//     Author: Raymond Lam (ray@lam-ray.com)
//
//     priority-queue.js may be freely distributed under the MIT license

// Default cmp function, which simply returns 1, -1, or 0 if a > b, a < b, or
// otherwise respectively.
function defaultCmp(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

module.exports = class {
  // Constructor takes initial elements of the priority queue (which defaults to
  // an empty array) and a comparator (which defaults to defaultCmp). It
  // constructs a priority queue, where the given comparator will always be used
  // for comparisons, and enqueues the given initial elements.
  constructor(init = [], cmp = defaultCmp) {
    this._cmp = cmp;

    // This priority queue is implemented as a binary min-heap represented by as
    // an array.
    this._heap = [];

    // enqueue in a loop rather than using the spread operator, to accomodate
    // very large init array (see issue #10)
    for (const element of init) this.enqueue(element);
  }

  // Define an iterator which successively dequeues from a clone of this
  // priority queue.
  [Symbol.iterator]() {
    return this.values();
  }

  // Removes all elements from the priority queue. Returns the number of
  // elements removed.
  clear() {
    const length = this.length;
    this._heap = [];
    return length;
  }

  // Shallow clone of the priority queue.
  clone() {

    // Should be O(n) time complexity, because elements enqueued directly from a
    // a heap will already be in the correct order and not need to be bubbled
    // up.

    if (this.constructor[Symbol.species])
      return new this.constructor[Symbol.species](this._heap, this._cmp);
    else
      return new this.constructor(this._heap, this._cmp);
  }

  // Returns an Array of the priority queue's elements in sorted order
  // concatenated with the given arguments.
  concat(...arrays) {
    return Array.from(this).concat(...arrays);
  }

  // Removes the minimum element of the priority queue, Returns undefined if the
  // priority queue is empty.
  dequeue() {
    // If there is only one element in the priority queue, just remove and
    // return it. If there are zero, return undefined.
    if (this._heap.length < 2) return this._heap.pop();

    // Save the return value, and put the last leaf of the heap at the root.
    const returnValue = this._heap[0];
    this._heap[0] = this._heap.pop();

    // The binary heap is represented as an array, where given an element at
    // index i, the first child is (i * 2) + 1, and the second child is at
    // (i * 2) + 2.
    //
    // Percolate down:
    // Initialize i, childI1 and childI2 at the root and its children
    // respectively. let nextI be the index of the minimum element of the
    // current element and its children. Stop if we've reached the end of the
    // heap or if the minimum element is the current element at i. Otherwise,
    // swap the current element at i with the element at nextI, and continue the
    // loop. For the next iteration of the loop, i becomes nextI (the index
    // whose element we'd swapped), and childI1 and childI2 are the indices of
    // the children.
    for (
      let i = 0, childI1 = 1, childI2 = 2, nextI;
      childI1 < this._heap.length && (
        nextI = this._minInHeap(
          i,
          childI1,
          childI2 < this._heap.length ? childI2 : undefined
        )
      ) !== i;
      i = nextI, childI1 = (i * 2) + 1, childI2 = childI1 + 1
    ) this._swapInHeap(i, nextI);

    return returnValue;
  }

  // Inserts each of the given arguments into the appropriate place in the
  // priority queue. Returns the resulting length of the priority queue.
  enqueue(...newValues) {
    for (const newValue of newValues) {
      // The enqueued element becomes the last leaf of the heap, which will be
      // bubbled up as necessary.
      this._heap.push(newValue);

      // The binary heap is represented as an array, where given an element at
      // index i, its parent is at floor((i - 1) / 2).
      //
      // Bubble up:
      // Start the loop at the last leaf of the heap. Stop the loop if the
      // current element is the root of the heap or if the current element
      // greater than or equal to the parent. Otherwise, swap the current
      // element with its parent, and continue the loop at the parent.

      for (
        let i = this._heap.length - 1, parentI = Math.floor((i - 1) / 2);
        i > 0 && this._cmpInHeap(i, parentI) < 0;
        i = parentI, parentI = Math.floor((parentI - 1) / 2)
      ) this._swapInHeap(i, parentI);
    }

    return this.length;
  }

  // Returns an Iterator which iterates over key/value pairs, where the values
  // are the values in the priority queue, and the keys are the positions those
  // values occupy in the priority queue.
  *entries() {
    let i = 0;
    for (const value of this) {
      yield [i++, value];
    }
  }

  // Tests whether all elements in the priority queue pass the test implemented
  // by the provided function.
  every(callback, thisArg) {
    for (const [i, element] of this.entries())
      if (!callback.call(thisArg, element, i, this)) return false;
    return true;
  }

  // Returns the value of the first element in the priority queue that satisfies
  // the provided testing function, or undefined otherwise.
  find(callback, thisArg) {
    for (const [i, element] of this.entries())
      if (callback.call(thisArg, element, i, this)) return element;
    return undefined;
  }

  // Returns the index of the first element in the priority queue that satisfies
  // the provided testing function, or undefined otherwise.
  findIndex(callback, thisArg) {
    for (const [i, element] of this.entries())
      if (callback.call(thisArg, element, i, this)) return i;
    return -1;
  }

  // Calls the given function on each element of the priority queue in order,
  // optionally in the context of the given thisArg.
  forEach(callback, thisArg) {
    for (const [i, element] of this.entries())
      callback.call(thisArg, element, i, this);
  }

  // Returns true if searchElement is present in the priority queue, starting
  // search at fromIndex
  includes(searchElement, fromIndex = 0) {
    // If fromIndex is 0, it means search the whole queue, in which case order
    // doesn't matter, so we can just delegate to the heap
    if (fromIndex === 0) return this._heap.includes(searchElement);

    // Negative fromIndex means start that many from the end of the priority
    // queue
    if (fromIndex < 0) fromIndex = this.length + fromIndex;

    // Return true if there is an element in the priority queue that is at
    // for after fromIndex that matches the searchElement.
    if (Number.isNaN(searchElement))
      return this.some((el, i) => i >= fromIndex && Number.isNaN(el));
    else
      return this.some((el, i) => i >= fromIndex && el === searchElement);
  }

  // Returns the first index at which a given element can be found in the array,
  // or -1 if it is not present
  indexOf(searchElement, fromIndex = 0) {
    if (fromIndex < 0) fromIndex = this.length + fromIndex;

    // This test fails for NaN, but that's okay, because it matches the
    // behavior of Array.prototype.indexOf
    return this.findIndex((el, i) => i >= fromIndex && el === searchElement);
  }

  // Creates a new priority queue with all elements that pass the test
  // implemented by the provided function.
  filter(callback, thisArg) {
    const pq = this.constructor[Symbol.species]
      ? new this.constructor[Symbol.species]([], this._cmp)
      : new this.constructor([], this._cmp);
    for (const [i, element] of this.entries())
      if (callback.call(thisArg, element, i, this))
        pq.enqueue(element);

    return pq;
  }

  // Joins the elements of the priority queue in sorted order into a string.
  join(...args) {
    return Array.from(this).join(...args);
  }

  // Returns the last index at which a given element can be found in the array,
  // or -1 if it is not present
  lastIndexOf(...args) {
    return Array.from(this).lastIndexOf(...args);
  }

  // Returns a new array with the results of calling a provided function on
  // every element in this priority queue in order.
  map(callback, thisArg) {
    const arr = [];
    for (const [i, element] of this.entries())
      arr.push(callback.call(thisArg, element, i, this));
    return arr;
  }

  // Returns an element of the priority queue without removing it.
  peek(searchIndex = 0) {
    if (searchIndex === 0) return this._heap[0];
    else {
      if (searchIndex < 0) searchIndex = this.length + searchIndex;
      return this.find((el, i) => i === searchIndex);
    }
  }

  // Applies a function against an accumulator and each value of the priority
  // queue in order to reduce it to a single value.
  reduce(callback, initialValue) {
    for (const [i, element] of this.entries())
      initialValue = callback(initialValue, element, i, this);
    return initialValue;
  }

  // Applies a function against an accumulator and each value of the priority
  // queue in reverse order to reduce it to a single value.
  reduceRight(callback, initialValue) {
    for (const [i, element] of Array.from(this.entries()).reverse())
      initialValue = callback(initialValue, element, i, this);
    return initialValue;
  }

  // Returns a shallow copy of a portion of an priority queue into a new
  // priority queue selected from begin to end (end not included). The original
  // array is not modified.
  slice(begin = 0, end = this.length) {

    if (begin < 0) begin = this.length + begin;
    if (end < 0) end = this.length + end;

    return this.filter((el, i) => i >= begin && i < end);
  }

  // Tests whether some element in the priority queue passes the test
  // implemented by the provided function.
  some(callback, thisArg) {
    for (const [i, element] of this.entries())
      if (callback.call(thisArg, element, i, this)) return true;
    return false;
  }

  // JSON.stringify of this priority queue should be the JSON of the elements
  // of the priority queue in a sorted array.
  toJSON() {
    return Array.from(this);
  }

  // The locale-specific string form of this priority queue should be the
  // locale-specific string form of an array of this priority queue's elements
  // in sorted order.
  toLocaleString() {
    return Array.from(this).toLocaleString();
  }

  // The string form of this priority queue should be the string form of an
  // array of this priority queue's elements in sorted order.
  toString() {
    return Array.from(this).toString();
  }

  // Returns a new Iterator which iterates over the priority queue's values,
  // without mutating the priority queue itself.
  *values() {
    // Clone this because we don't want to mutate the original priority queue by
    // iterating over its elements.
    const priorityQueue = this.clone();

    while (priorityQueue.length) {
      yield priorityQueue.dequeue();
    }
  }

  // length accessor is simply the number of elements currently in the priority
  // queue.
  get length() {
    return this._heap.length;
  }

  // Helper method. Returns the result of the comparator function on the
  // elements located at the given indices in the heap array.
  _cmpInHeap(i1, i2) {
    return this._cmp(this._heap[i1], this._heap[i2]);
  }

  // Helper method. Given two or three indices of the heap array, compares the
  // corresponding elements and returns the index to the minimum element of
  // them.
  _minInHeap(i1, i2, i3) {

    // First compare the elements at the first two given indices. Return the
    // index for minimum of them, or if we are given a third index, compare with
    // that corresponding element and return the minimum of them.
    const i = this._cmpInHeap(i1, i2) > 0 ? i2 : i1;
    if (typeof i3 === 'undefined') return i;
    else return this._cmpInHeap(i, i3) > 0 ? i3 : i;
  }

  // Helper method. Swaps the elements at the given indices of the heap array.
  _swapInHeap(i1, i2) {
    const tmp = this._heap[i1];
    this._heap[i1] = this._heap[i2];
    this._heap[i2] = tmp;
  }
};
