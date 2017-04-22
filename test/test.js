import PriorityQueue from "../src/priority-queue";
import { expect } from 'chai';

// Helper function which asserts that the given method passes the original
// priority queue into the callback function. Takes as arguments the name of the
// method and a return value for the callback function.
function itShouldPassTheOriginalPriorityQueueToTheCallbackFunction(methodName, returnValue) {
  it('should pass the original priority queue to the callback function', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    pq[methodName](function(element, index, pqReference) {
      expect(pqReference).to.equal(pq);
      return returnValue;
    });
  });
}

// Helper function which asserts that the given method sets the context of the
// callback function correctly. Takes as arguments the name of the method and
// a return value for the callback function.
function itShouldSetTheContextOfTheCallbackCorrectly(methodName, returnValue) {
  it(`should set the context of the callback to the same value that Array.prototype.${methodName} would by default`, function() {
    let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    let context;
    pq[methodName](function() {
      context = this;
      return returnValue;
    });

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][methodName](function() {
      expect(this).to.equal(context);
      return returnValue;
    });

  });

  it('should set the context of the callback to the given argument', function() {
    let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    let context = {};
    pq[methodName](function() {
      expect(this).to.equal(context);
      return false;
    }, context);

  });

}

describe('constructor', function() {
  it('should create an empty priority queue constructor given no arguments' , function() {
    expect((new PriorityQueue()).length).to.equal(0);
  });

  it('should create a correctly sorted priority queue given an unsorted array', function() {
    let pq = new PriorityQueue([2, 9, 3, 8, 4, 5]);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([2, 3, 4, 5, 8, 9]);
  });

  it('should create a correctly sorted priority queue given an unsorted array and an alternative comparator', function() {
    let pq = new PriorityQueue([2, 9, 3, 8, 3, 5], function(a, b) {
      if (a > b) return -1;
      else if (a < b) return 1;
      else return 0;  
    });

    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([9, 8, 5, 3, 3, 2]);
  });

  it('should create a priority queue which will sort correctly given an empty array and an alternative comparator', function() {
    let pq = new PriorityQueue([], function(a, b) {
      if (a > b) return -1;
      else if (a < b) return 1;
      else return 0;  
    });

    pq.enqueue(2);
    pq.enqueue(9);
    pq.enqueue(3);
    pq.enqueue(8);
    pq.enqueue(5);
    pq.enqueue(3);

    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([9, 8, 5, 3, 3, 2]);
  });

});

describe('iteratable protocol', function() {
  it('should output the elements of the priority queue exactly, not copies, in the correct order', function() {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ value: 6 });
    pq.enqueue({ value: 3 });

    for (let el of pq) {
      expect(el).to.equal(pq.dequeue());
    }
  });

  it('should not mutate the priority queue', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    
    let arrayFromPQ = Array.from(pq);

    expect(pq.length).to.equal(5);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3, 4, 5]);
  });

});

describe('#clear', function() {
  it('should remove all elements from a priority queue', function() {
    let pq = new PriorityQueue();

    pq.enqueue(0);
    pq.enqueue(1);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;

  });

  it('should remove all elements from a priority queue with initial elements', function() {
    let pq = new PriorityQueue([0, 1, 2]);
    pq.enqueue(3);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;

  });

  it('should remove all elements from a priority queue with initial elements in its initial state', function() {
    let pq = new PriorityQueue([0, 1, 2]);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should not materially change an empty priority queue', function() {
    let pq = new PriorityQueue([1]);
    pq.dequeue();

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should not materially change an empty priority queue in its initial state', function() {
    let pq = new PriorityQueue();

    pq.clear();

    expect(pq.length).to.equal(0);
  });
});

describe('#clone', function() {
  it('should not return a reference to the same priority queue', function() {
    let pq = new PriorityQueue([1, 2, 3]);
    expect(pq.clone()).not.to.equal(pq);
  });

  it('should return a priority queue that references the same elements in the same order', function() {
   let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ value: 6 });
    pq.enqueue({ value: 3 });

    let clone = pq.clone();

    while (clone.length && pq.length) {
      expect(clone.dequeue()).to.equal(pq.dequeue());
    }
  });

  it('should return a priority queue which can be mutated without affecting the original priority queue', function() {
    let pq = new PriorityQueue([3, 2, 1]);
    let clone = pq.clone();

    clone.enqueue(0);

    expect(pq.length).to.equal(3);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3]);
  });

});

describe('#dequeue', function() {
  it('should return exactly the element at the head for a priority queue with initial elements', function() {
    let head = { value: 1 };
    let pq = new PriorityQueue([], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue(head);
    pq.enqueue({ value: 3 });
    pq.enqueue({ value: 2 });
    expect(pq.dequeue()).to.equal(head);
  });
  
  it('should return exactly the element at the head for a priority queue', function() {
    let head = { value: 1 };
    let pq = new PriorityQueue([
      { value: 3 },
      { value: 2 },
      head,
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    expect(pq.dequeue()).to.equal(head);
  });

  it('should return undefined if called on an empty priority queue', function() {
    let pq = new PriorityQueue();
    pq.enqueue(1);
    pq.dequeue();
    
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should return undefined if called on an empty priority queue in its initial state', function() {
    let pq = new PriorityQueue();
    expect(pq.dequeue()).to.be.undefined;
  });
});

describe('#enqueue', function() {
  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4]);
    pq.enqueue(-2);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4, 5]);
    pq.enqueue(-2);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4, 5, 6]);
    pq.enqueue(-2);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5, 6]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3]);
    pq.enqueue(4);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3, 4]);
    pq.enqueue(5);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3, 4, 5]);
    pq.enqueue(6);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5, 6]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4]);
    pq.enqueue(-1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-1, -1, 0, 1, 2, 3, 4]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4, 5]);
    pq.enqueue(-1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-1, -1, 0, 1, 2, 3, 4, 5]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-1, 0, 1, 2, 3, 4, 5, 6]);
    pq.enqueue(-1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-1, -1, 0, 1, 2, 3, 4, 5, 6]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3]);
    pq.enqueue(3);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 3]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3, 4]);
    pq.enqueue(4);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 4]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 2, 3, 4, 5]);
    pq.enqueue(5);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5, 5]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element which belongs in the middle of the queue, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-2, -1, 0, 2, 3, 4]);
    pq.enqueue(1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element that belongs in the middle of the queue, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 3, 4, 5]);
    pq.enqueue(2);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element that belongs in the middle of the queue, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 3, 4, 5, 6]);
    pq.enqueue(2);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 2, 3, 4, 5, 6]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the heap becomes full', function() {
    let pq = new PriorityQueue([-2, -1, 1, 2, 3, 4]);
    pq.enqueue(1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 1, 1, 2, 3, 4]);
  });

  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the tail element becomes a first child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 3, 4, 5]);
    pq.enqueue(1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 1, 3, 4, 5]);
  });
  
  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the tail element becomes a second child in the heap', function() {
    let pq = new PriorityQueue([-2, -1, 0, 1, 3, 4, 5, 6]);
    pq.enqueue(1);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([-2, -1, 0, 1, 1, 3, 4, 5, 6]);
  });
  
  it('should take multiple elements and enqueue them to the right positions', function() {
    let pq = new PriorityQueue([5, 3, 1]);
    pq.enqueue(2, 6, 0);
    
    expect(pq.length).to.equal(6);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([0, 1, 2, 3, 5, 6]);
  });

  it('should return the resultant length of the priority queue', function() {
    let pq = new PriorityQueue([1, 2, 3]);
    expect(pq.enqueue(0)).to.equal(4);
  });

});

describe('#entries', function() {
  it('should return an iterator', function() {
    let pq = new PriorityQueue([0, 1, 2]);

    expect(pq.entries()).to.respondTo('next');

    let it = pq.entries();
    expect(it.next()).to.have.property('value');
    it.next();
    it.next();
    expect(it.next().done).to.be.true;

  });

  it('should return an iterator which outputs key-value pairs of the elements of the priority queue, where the values are the elements exactly, not copies, in the correct order', function() {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ value: 6 });
    pq.enqueue({ value: 3 });

    let i = 0;
    for (let el of pq.entries()) {
      expect(el[0]).to.equal(i++);
      expect(el[1]).to.equal(pq.dequeue());
    }
  });

  it('should return an iterator that does not mutate the priority queue', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    
    let arrayFromPQ = Array.from(pq.entries());

    expect(pq.length).to.equal(5);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should return iterators which are independent of one another', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);

    let it0 = pq.entries();
    let it1 = pq.entries();

    let result = [it0.next().value, it1.next().value];
    result.push(...it0, ...it1);
    expect(result).to.deep.equal([
      [0, 1],
      [0, 1],
      [1, 2], 
      [2, 3], 
      [3, 4], 
      [4, 5], 
      [1, 2], 
      [2, 3], 
      [3, 4], 
      [4, 5],
    ]);
  });

});

describe('#every', function() {
  it('should return what Array.prototype.every would when none of the elements satisfy the predicate', function() {
    function predicate(element) {
      return !(element % 3);
    }

    expect(
      (new PriorityQueue([1, 2, 4, 5])).every(predicate)
    ).to.equal(
      [1, 2, 4, 5].every(predicate)
    );
  });
  
  it('should return what Array.prototype.every would when some of the elements satisfy the predicate', function() {
    function predicate(element) {
      return !(element % 3);
    }

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).every(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].every(predicate)
    );
  });
  
  it('should return what Array.prototype.every would when all of the elements satisfy the predicate', function() {
    function predicate() {
      return true;
    }

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).every(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].every(predicate)
    );
  });

  it('should iterate through the elements the way Array.prototype.every would', function() {
    let pqIndices = [];
    (new PriorityQueue([5, 6, 7, 8, 9])).every(function(element, index) {
      pqIndices.push(index);
      return element < 7;
    });

    let arrIndices = [];

    [5, 6, 7, 8, 9].every(function(element, index) {
      arrIndices.push(index);
      return element < 7;
    });

    expect(pqIndices).to.deep.equal(arrIndices);

  });

  it('should return what Array.prototype.every would for an empty Array if the priority queue is empty', function() {
    expect(
      (new PriorityQueue()).every(function() { return false; })
    ).to.equal(
      [].every(function() { return false; })
    );
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('every', false);
  itShouldSetTheContextOfTheCallbackCorrectly('every', false);

});


describe('#includes', function() {
  it("should return what an empty Array's #include would return", function() {
    expect(
      (new PriorityQueue([])).includes(3)
    ).to.equal(
      [].includes(3)
    );
  });

  it("should return what an empty Array's #include would return, with fromIndex", function() {
    expect(
      (new PriorityQueue([])).includes(3, 2)
    ).to.equal(
      [].includes(3, 2)
    );
  });
 
  it("should return what an empty Array's #include would return, with negative fromIndex", function() {
    expect(
      (new PriorityQueue([])).includes(3, -2)
    ).to.equal(
      [].includes(3, -2)
    );
  });
  
  it("should return what Array's #include would return where the search element is present", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(3)
    ).to.equal(
      [2, 3, 4, 5].includes(3)
    );
  });
  
  it("should return what Array's #include would return where the search element is not present", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(1)
    ).to.equal(
      [2, 3, 4, 5].includes(1)
    );
  });
  
  it("should return what Array's #include would return where the search element is present, 0 fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(3, 0)
    ).to.equal(
      [2, 3, 4, 5].includes(3, 0)
    );
  });
  
  it("should return what Array's #include would return where the search element is not present, 0 fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(1, 0)
    ).to.equal(
      [2, 3, 4, 5].includes(1, 0)
    );
  });

  it("should return what Array's #include would return where the search element is present in search segment", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(4, 1)
    ).to.equal(
      [2, 3, 4, 5].includes(4, 1)
    );
  });
  
  it("should return what Array's #include would return where the search element is present but not in search segment", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(2, 3)
    ).to.equal(
      [2, 3, 4, 5].includes(2, 3)
    );
  });
  
  it("should return what Array's #include would return where the search element is not present in search segment or rest of priority queue", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(1, 1)
    ).to.equal(
      [2, 3, 4, 5].includes(1, 1)
    );
  });
  
  it("should return what Array's #include would return where the search element is present in search segment, negative fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(4, -2)
    ).to.equal(
      [2, 3, 4, 5].includes(4, -2)
    );
  });
  
  it("should return what Array's #include would return where the search element is present but not in search segment, negative fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(2, -1)
    ).to.equal(
      [2, 3, 4, 5].includes(2, -1)
    );
  });
  
  it("should return what Array's #include would return where the search element is not present in search segment or rest of priority queue, negative fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(1, -1)
    ).to.equal(
      [2, 3, 4, 5].includes(1, -1)
    );
  });

  it("should return what Array's #include would return where the search element is NaN and is present", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN])).includes(NaN)
    ).to.equal(
      [2, 3, 4, 5, NaN].includes(NaN)
    );
  });
  
  it("should return what Array's #include would return where the search element is NaN and is not present", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).includes(NaN)
    ).to.equal(
      [2, 3, 4, 5].includes(NaN)
    );
  }); 
  
  it("should return what Array's #include would return where the search element is NaN and is present in search segment", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], function(a, b) {
        if (Number.isNaN(a)) return 1;
        else if (Number.isNaN(b)) return -1;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).includes(NaN, 1)
    ).to.equal(
      [2, 3, 4, 5, NaN].includes(NaN, 1)
    );
  }); 
  
  it("should return what Array's #include would return where the search element is NaN and is present in search segment, negative fromIndex", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], function(a, b) {
        if (Number.isNaN(a)) return -1;
        else if (Number.isNaN(b)) return 1;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).includes(NaN, -5)
    ).to.equal(
      [NaN, 2, 3, 4, 5].includes(NaN, -5)
    );
  });

  it("should return what Array's #include would return where the search element is NaN and is present but not in search segment", function() {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], function(a, b) {
        if (Number.isNaN(a)) return -1;
        else if (Number.isNaN(b)) return 1;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).includes(NaN, 1)
    ).to.equal(
      [NaN, 2, 3, 4, 5].includes(NaN, 1)
    );
  }); 
});

describe('#join', function() {
  it('should join the elements of the priority queue in sorted order', function() {
    expect((new PriorityQueue(['z', 'y', 'x'])).join()).to.equal(['x', 'y', 'z'].join());
  });
  
  it('should join the elements of the priority queue in sorted order, with separator', function() {
    expect((new PriorityQueue(['z', 'y', 'x'])).join('::')).to.equal(['x', 'y', 'z'].join('::'));
  });
});

{ 
  let describeFindMethod = function(methodName) {
    describe(`#${methodName}`, function() {
      it('should find the same element that Array would find, the elements being iterated over in sorted order', function() {
        function predicate(element) {
          return element === 'x' || element === 'y';
        }

        let pq = new PriorityQueue(
          [ 
            { value: 'z' }, 
            { value: 'y' }, 
            { value: 'x' }, 
            { value: 'w' }
          ], function(a, b) {
            if (a.value > b.value) return 1;
            else if (a.value < b.value) return -1;
            else return 0;
          }
        );

        expect(
          pq[methodName](predicate)
        ).to.equal(
          Array.from(pq)[methodName](predicate)
        );
      });
      
      it(`should return what Array.prototype.${methodName} would return if the element is not found`, function() {
        function predicate(element) {
          return element === 'q'
        }

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](predicate)
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](predicate)
        );
      });
      
      it(`should return what Array.prototype.${methodName} for an empty array if the priority queue is empty`, function() {
        function predicate(element) {
          return element === 'q'
        }

        let pq = new PriorityQueue();

        expect(
          pq[methodName](predicate)
        ).to.equal(
          [][methodName](predicate)
        );
      });     
     
      it(`should call the callback function passing an index the way that Array.prototype.${methodName} would`, function() {
        let indices = [];
        function predicate(element, index) {
          indices.push(index);
          return element === 'y';
        }

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);
        pq[methodName](predicate);
        let pqIndices = [...indices];

        indices = [];
        ['w', 'x', 'y', 'z'][methodName](predicate);
        let arrIndices = [...indices];

        expect(pqIndices).to.deep.equal(arrIndices);
      });

      it('should iterate through all elements of the priority queue that were there at the time of call, even if the callback removes elements from the original priority queue', function() {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName](function(element) {
          elements.push(element);
          pq.dequeue();
        });

        expect(elements.reduce(function(accumulator, element) { return accumulator + element; }, 0)).to.equal(55);

      });
      
      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds elements to the original priority queue', function() {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName](function(element, index) {
          elements.push(element);
          pq.enqueue(index + 1);
          pq.enqueue(index + 2);
        });

        expect(elements.reduce(function(accumulator, element) { return accumulator + element; }, 0)).to.equal(55);

      });

      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds and removes elements to and from the original priority queue', function() {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName](function(element, index) {
          elements.push(element);
          pq.enqueue(pq.dequeue() + 1);
        });

        expect(elements.reduce(function(accumulator, element) { return accumulator + element; }, 0)).to.equal(55);
      
      });

      itShouldPassTheOriginalPriorityQueueToTheCallbackFunction(methodName, false);
      itShouldSetTheContextOfTheCallbackCorrectly(methodName, false);
    });
  };
  
  describeFindMethod('find');
  describeFindMethod('findIndex');
}

describe('#map', function() {
  it('should return an Array', function() {
    expect((new PriorityQueue(
      [
        5, 
        4, 
        3, 
        2, 
        1,
      ]
    )).map(function(element) { return element; })).to.be.an('array');
  });

  it('should return what Array.prototype.map would', function() {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    let callback = function(element) {
      return element.value;
    };

    expect(pq.map(callback)).to.deep.equal([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ].map(callback));
  });

  it('should return what Array.prototype.map would when the priority queue is empty', function() {
    let pq = new PriorityQueue();

    let callback = function(element) {
      return { value: element };
    };

    expect(pq.map(callback)).to.deep.equal([].map(callback));
  });

  it('should disregard elements which are enqueued in the callback', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    expect(pq.map(function(element) {
      pq.enqueue(10);
      return element;
    })).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should map elements even if they are dequeued in the callback', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    expect(pq.map(function(element) {
      pq.dequeue();
      return element;
    })).to.deep.equal([1, 2, 3, 4, 5]);
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('map');
  itShouldSetTheContextOfTheCallbackCorrectly('map');
});

describe('#length', function() {
  it('should be correct for a zero-length priority queue', function() {
    expect((new PriorityQueue()).length).to.equal(0);
  });

  it('should increment correctly from a zero-length priority queue', function() {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    expect(pq.length).to.equal(1);
  });

  it('should increment correctly from non-zero-length priority queue more than once', function() {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    expect(pq.length).to.equal(2);
  });

  it('should increment correctly if duplicate element is enqueued', function() {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    pq.enqueue(0);
    pq.enqueue(-1);
    pq.enqueue(0);
    expect(pq.length).to.equal(5);
  });

  it('should be correct for a priority queue with initial elements', function() {
    expect((new PriorityQueue([3, 3, 1])).length).to.equal(3);
  });

  it('should increment correctly from priority queue with inital elements', function() {
    let pq = new PriorityQueue([3, 3, 1]);
    pq.enqueue(4);
    expect(pq.length).to.equal(4);
  });
 
  it('should not decrement to less than zero', function() {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(3);
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  }); 
  
  it('should not decrement to less than zero on a zero-length priority queue' , function() {
    let pq = new PriorityQueue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  });

  it('should not decrement to less than zero on a priority queue with initial elements', function() {
    let pq = new PriorityQueue([3, 2, 1]);
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  });

  it('should decrement correctly to a non-zero value', function() {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    pq.enqueue(0);
    pq.enqueue(-1);
    pq.enqueue(0);
    pq.dequeue();
    expect(pq.length).to.equal(4);
  });

  it('should decrement correctly for a priority queue with initial elements', function() {
    let pq = new PriorityQueue([3, 3, 1]);
    pq.dequeue();
    expect(pq.length).to.equal(2);
  });

  it('should increment correctly when removing duplicate element', function() {
    let pq = new PriorityQueue([1, 1, 1, 2, 3]);
    pq.dequeue();
    expect(pq.length).to.equal(4);
  });
});

describe('#peak', function() {

  it('should return exactly the head element for a priority queue', function() {

    let pq = new PriorityQueue([], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
   

    let head = { value: 1 }; 
    pq.enqueue({ value: 3 });
    pq.enqueue(head);
    pq.enqueue({ value: 2 });
    
    expect(pq.peek()).to.equal(head); 
  });

  it('should return exactly the head element for a priority queue with initial elements', function() {

    let head = { value: 1 }; 
    let pq = new PriorityQueue([
      { value: 2 },
      { value: 3 },
      head,
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
    
    expect(pq.peek()).to.equal(head); 
  });

  it('should not mutate the priority queue', function() {
    let pq = new PriorityQueue();
    pq.enqueue(1);
    pq.enqueue(2);
    pq.enqueue(3);
    pq.peek();

    expect(pq.length).to.equal(3);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3]);
    
  });
});

{ 
  let describeReduceMethod = function(methodName) {
    describe(`#${methodName}`, function() {
      it('should reduce in the same manner that an Array reduces, the elements being iterated over in sorted order', function() {
        function concatReduce(accumulator, currentValue) {
          return accumulator + currentValue;
        }

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](concatReduce, '')
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](concatReduce, '')
        );
      });

      it('should reduce an empty priority queue in the same manner that an Array reduces an empty Array', function() {
        function concatReduce(accumulator, currentValue) {
          return accumulator + currentValue;
        }

        let pq = new PriorityQueue();

        expect(
          pq[methodName](concatReduce, 'a')
        ).to.equal(
          [][methodName](concatReduce, 'a')
        );
      });

      it('should call the callback function passing an index the way that Array.prototype.reduce would', function() {
        function indexReduce(accumulator, currentValue, currentIndex) {
          return [accumulator, currentIndex].join(',');
        }

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](indexReduce, '')
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](indexReduce, '')
        );
      });

      it('should pass the original priority queue to the callback function', function() {
        let pq = new PriorityQueue([5, 4, 3, 2, 1]);
        pq[methodName](function(accumulator, currentValue, currentIndex, pqReference) {
          expect(pqReference).to.equal(pq);
        });
      });

      it('should iterate through all elements of the priority queue that were there at the time of call, even if the callback removes elements from the original priority queue', function() {
        expect(
          (new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))[methodName](
            function(accumulator, currentValue, currentIndex, pq) {
              pq.dequeue();
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(55);
      });
      
      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds elements to the original priority queue', function() {
        expect(
          (new PriorityQueue([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]))[methodName](
            function(accumulator, currentValue, currentIndex, pq) {
              pq.enqueue(currentIndex + 1);
              pq.enqueue(currentIndex + 2);
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(65);
      });

      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds and removes elements to and from the original priority queue', function() {
        expect(
          (new PriorityQueue([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]))[methodName](
            function(accumulator, currentValue, currentIndex, pq) {
              pq.enqueue(pq.dequeue() + 1);
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(65);
      });
    });
  };

  describeReduceMethod('reduce');
  describeReduceMethod('reduceRight');
}

describe('#some', function() {
  it('should return what Array.prototype.some would when none of the elements satisfy the predicate', function() {
    function predicate(element) {
      return !(element % 3);
    }

    expect(
      (new PriorityQueue([1, 2, 4, 5])).some(predicate)
    ).to.equal(
      [1, 2, 4, 5].some(predicate)
    );
  });
  
  it('should return what Array.prototype.some would when some of the elements satisfy the predicate', function() {
    function predicate(element) {
      return !(element % 3);
    }

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).some(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].some(predicate)
    );
  });
  
  it('should return what Array.prototype.some would when all of the elements satisfy the predicate', function() {
    function predicate() {
      return true;
    }

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).some(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].some(predicate)
    );
  });

  it('should iterate through the elements the way Array.prototype.some would', function() {
    let pqIndices = [];
    (new PriorityQueue([5, 6, 7, 8, 9])).some(function(element, index) {
      pqIndices.push(index);
      return element === 7;
    });

    let arrIndices = [];

    [5, 6, 7, 8, 9].some(function(element, index) {
      arrIndices.push(index);
      return element === 7;
    });

    expect(pqIndices).to.deep.equal(arrIndices);

  });

  it('should return what Array.prototype.some would for an empty Array if the priority queue is empty', function() {
    expect(
      (new PriorityQueue()).some(function() { return false; })
    ).to.equal(
      [].some(function() { return false; })
    );
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('some', false);
  itShouldSetTheContextOfTheCallbackCorrectly('some', false);

});

describe('#toLocaleString', function(){ 
  it('should return the same as #toLocaleString of a sorted Array for a priority queue', function() {
    let pq = new PriorityQueue([], function(a, b) {
      let aTime = a.getTime();
      let bTime = b.getTime();

      if (aTime > bTime) return 1;
      else if (aTime < bTime) return -1;
      else return 0;
    });

    pq.enqueue(new Date(4));
    pq.enqueue(new Date(3));
    pq.enqueue(new Date(2));
    pq.enqueue(new Date(1));
    expect(pq.toLocaleString()).to.equal(([
      new Date(1), 
      new Date(2), 
      new Date(3), 
      new Date(4),
    ]).toLocaleString());
  });
  
  it('should return the same as #toLocaleString of a sorted Array for a priority queue with initial values', function() {
    expect(
      (new PriorityQueue([
        new Date(4), 
        new Date(3), 
        new Date(2), 
        new Date(1),
      ], function(a, b) {
        let aTime = a.getTime();
        let bTime = b.getTime();

        if (aTime > bTime) return 1;
        else if (aTime < bTime) return -1;
        else return 0;
      })).toLocaleString()
    ).to.equal(
      [
        new Date(1), 
        new Date(2), 
        new Date(3), 
        new Date(4),
      ].toLocaleString()
    );
  });

  it('should return the same as #toLocaleString of an empty Array when the priority queue is empty', function() {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect((new PriorityQueue()).toLocaleString()).to.equal(([]).toLocaleString());
  });

  it('should return the same as #toLocaleString of an empty Array when the priority queue is empty and in its initial state', function() {
    expect((new PriorityQueue()).toLocaleString()).to.equal(([]).toLocaleString());
  }); 
});

describe('#toString', function(){
  it('should return the same as #toString of a sorted Array for a priority queue', function() {
    let pq = new PriorityQueue();
    pq.enqueue(4);
    pq.enqueue(3);
    pq.enqueue(2);
    pq.enqueue(1);
    expect(pq.toString()).to.equal(([1, 2, 3, 4]).toString());
  });
  
  it('should return the same as #toString of a sorted Array for a priority queue with initial values', function() {
    expect((new PriorityQueue([4, 3, 2, 1])).toString()).to.equal(([1, 2, 3, 4]).toString());
  });

  it('should return the same as #toString of an empty Array when the priority queue is empty', function() {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect((new PriorityQueue()).toString()).to.equal(([]).toString());
  });

  it('should return the same as #toString of an empty Array when the priority queue is empty and in its initial state', function() {
    expect((new PriorityQueue()).toString()).to.equal(([]).toString());
  });  

});

describe('#values', function() {
  it('should return an iterator', function() {
    let pq = new PriorityQueue([0, 1, 2]);

    expect(pq.values()).to.respondTo('next');

    let it = pq.values();
    expect(it.next()).to.have.property('value');
    it.next();
    it.next();
    expect(it.next().done).to.be.true;

  });

  it('should return an iterator which outputs the elements of the priority queue exactly, not copies, in the correct order', function() {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ value: 6 });
    pq.enqueue({ value: 3 });

    for (let el of pq.values()) {
      expect(el).to.equal(pq.dequeue());
    }
  });

  it('should return an iterator that does not mutate the priority queue', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    
    let arrayFromPQ = Array.from(pq.values());

    expect(pq.length).to.equal(5);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should return iterators which are independent of one another', function() {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);

    let it0 = pq.values();
    let it1 = pq.values();

    expect([...it0, ...it1]).to.deep.equal([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
  });

});



describe('JSON.stringify', function(){
  it('should return the same as JSON.stringify([]) when the priority queue is empty', function() {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect(JSON.stringify(new PriorityQueue())).to.equal(JSON.stringify([]));
  });

  it('should return the same as JSON.stringify([]) when the priority queue is empty and in its initial state', function() {
    expect(JSON.stringify(new PriorityQueue())).to.equal(JSON.stringify([]));
  });

  it('should return the same as JSON.stringify of a sorted array of the elements of the priority queue', function() {
    let pq = new PriorityQueue([], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ value: 4 });
    pq.enqueue({ value: 3 });
    pq.enqueue({ value: 2 });
    pq.enqueue({ value: 1 });
    expect(JSON.stringify(pq)).to.deep.equal(JSON.stringify([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },  
    ]));
  });
  
  it('should return the same as JSON.stringify of a sorted array of the elements of the priority queue where the elements have a toJSON method defined', function() {
    let pq = new PriorityQueue([], function(a, b) {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ 
      value: 4,
      toJSON: function() { return 'd'; },
    });
    pq.enqueue({ 
      value: 3 ,
      toJSON: function() { return 'c'; },
    });
    pq.enqueue({ 
      value: 2,
      toJSON: function() { return 'b' },
    });
    pq.enqueue({ 
      value: 1,
      toJSON: function() { return 'a' },
    });

    expect(JSON.stringify(pq)).to.deep.equal(JSON.stringify(['a', 'b', 'c', 'd']));
  });

});
