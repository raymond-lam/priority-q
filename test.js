const PriorityQueue = require('./index.js');
const {expect} = require('chai');

const BIG_NUMBER_OF_THINGS = 500000;
const BIG_ARRAY = Array.from({length: BIG_NUMBER_OF_THINGS}).map((element, i) => i).reverse();

// Helper function which asserts that the given method passes the original
// priority queue into the callback function. Takes as arguments the name of the
// method and a return value for the callback function.
function itShouldPassTheOriginalPriorityQueueToTheCallbackFunction(methodName, returnValue) {
  it('should pass the original priority queue to the callback function', () => {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    pq[methodName]((element, index, pqReference) => {
      expect(pqReference).to.equal(pq);
      return returnValue;
    });
  });
}

// Helper function which asserts that the given method sets the context of the
// callback function correctly. Takes as arguments the name of the method and
// a return value for the callback function.
function itShouldSetTheContextOfTheCallbackCorrectly(methodName, returnValue) {
  it(`should set the context of the callback to the same value that Array.prototype.${methodName} would by default`, () => {
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

  it('should set the context of the callback to the given argument', () => {
    let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    let context = {};
    pq[methodName](function() {
      expect(this).to.equal(context);
      return false;
    }, context);

  });

}

// Helper function which asserts that the given method does not throw if the
// priority queue is very large.
function itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge(methodName, ...methodArguments) {
  let pq = new PriorityQueue();
  
  for (const i of BIG_ARRAY) pq.enqueue(i);

  it('should not throw an exception of the priority queue is very large (issue #10)', () => {
    expect(() => pq[methodName](...methodArguments)).not.to.throw();
  });
}

function itShouldRespectSpecies(methodName, ...methodArguments) {
  it('should return a priority queue of the same type by default', () => {
    class PriorityQueueChild extends PriorityQueue {};

    expect(
      (new PriorityQueueChild([1, 2, 3]))[methodName](...methodArguments)
    ).to.be.instanceOf(PriorityQueueChild);
  });

  it('should return a priority queue of the type specified by Symbol.species', () => {
    class PriorityQueueChild1 extends PriorityQueue {};
    class PriorityQueueChild2 extends PriorityQueue {
      static get [Symbol.species]() { 
        return PriorityQueueChild1;
      }
    };

    expect(
      (new PriorityQueueChild2([1, 2, 3]))[methodName](...methodArguments)
    ).to.be.instanceOf(PriorityQueueChild1);

  });

}

describe('constructor', () => {
  it('should create an empty priority queue constructor given no arguments' , () => {
    expect((new PriorityQueue()).length).to.equal(0);
  });

  it('should create a correctly sorted priority queue given an unsorted array', () => {
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

  it('should create a correctly sorted priority queue given an unsorted array and an alternative comparator', () => {
    let pq = new PriorityQueue([2, 9, 3, 8, 3, 5], (a, b) => {
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

  it('should create a priority queue which will sort correctly given an empty array and an alternative comparator', () => {
    let pq = new PriorityQueue([], (a, b) => {
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

  it('should not throw an exception if given a very large array (issue #10)', () => {
    expect(() => new PriorityQueue(BIG_ARRAY)).to.not.throw();
  })

});

describe('iteratable protocol', () => {
  it('should output the elements of the priority queue exactly, not copies, in the correct order', () => {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], (a, b) => {
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

  it('should not mutate the priority queue', () => {
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

  it('should not throw an exception if the priority queue is very large (issue #10)', () => {
    const pq = new PriorityQueue();
    
    for (const i of BIG_ARRAY) pq.enqueue(i);

    expect(() => Array.from(pq)).to.not.throw();
  });

});

describe('#clear', () => {
  it('should remove all elements from a priority queue', () => {
    let pq = new PriorityQueue();

    pq.enqueue(0);
    pq.enqueue(1);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;

  });

  it('should remove all elements from a priority queue with initial elements', () => {
    let pq = new PriorityQueue([0, 1, 2]);
    pq.enqueue(3);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;

  });

  it('should remove all elements from a priority queue with initial elements in its initial state', () => {
    let pq = new PriorityQueue([0, 1, 2]);

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should not materially change an empty priority queue', () => {
    let pq = new PriorityQueue([1]);
    pq.dequeue();

    pq.clear();

    expect(pq.length).to.equal(0);
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should not materially change an empty priority queue in its initial state', () => {
    let pq = new PriorityQueue();

    pq.clear();

    expect(pq.length).to.equal(0);
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('clear');
});

describe('#clone', () => {
  it('should not return a reference to the same priority queue', () => {
    let pq = new PriorityQueue([1, 2, 3]);
    expect(pq.clone()).not.to.equal(pq);
  });

  it('should return a priority queue that references the same elements in the same order', () => {
   let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], (a, b) => {
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

  it('should return a priority queue which can be mutated without affecting the original priority queue', () => {
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

  itShouldRespectSpecies('clone'); 
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('clone');
});

describe('#concat', () => {
  it("should return an Array", () => {
    expect((new PriorityQueue([5, 3, 1])).concat()).to.be.an('array');
  });

  it("should return a concatenation of an Array of the priority queue's sorted elements with the arguments", () => {
    expect(
      (new PriorityQueue([5, 3, 1])).concat([1, 2, 3], 7, [6])
    ).to.deep.equal([1, 3, 5].concat([1, 2, 3], 7, [6]));
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('concat', [1, 2, 3]);
});

describe('#dequeue', () => {
  it('should return exactly the element at the head for a priority queue with initial elements', () => {
    let head = { value: 1 };
    let pq = new PriorityQueue([], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue(head);
    pq.enqueue({ value: 3 });
    pq.enqueue({ value: 2 });
    expect(pq.dequeue()).to.equal(head);
  });
  
  it('should return exactly the element at the head for a priority queue', () => {
    let head = { value: 1 };
    let pq = new PriorityQueue([
      { value: 3 },
      { value: 2 },
      head,
    ], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    expect(pq.dequeue()).to.equal(head);
  });

  it('should return undefined if called on an empty priority queue', () => {
    let pq = new PriorityQueue();
    pq.enqueue(1);
    pq.dequeue();
    
    expect(pq.dequeue()).to.be.undefined;
  });

  it('should return undefined if called on an empty priority queue in its initial state', () => {
    let pq = new PriorityQueue();
    expect(pq.dequeue()).to.be.undefined;
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('dequeue');
});

describe('#enqueue', () => {
  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is less than any other element, such that the tail element becomes a second child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is greater than any other element, such that the tail element becomes a second child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the head element, such that the tail element becomes a second child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element is equal to the tail element, such that the tail element becomes a second child in the heap', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element which belongs in the middle of the queue, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element that belongs in the middle of the queue, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element that belongs in the middle of the queue, such that the tail element becomes a second child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the heap becomes full', () => {
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

  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the tail element becomes a first child in the heap', () => {
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
  
  it('should result in a correctly sorted priority queue when the enqueued element that equals an element in the middle of the queue, such that the tail element becomes a second child in the heap', () => {
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
  
  it('should take multiple elements and enqueue them to the right positions', () => {
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

  it('should return the resultant length of the priority queue', () => {
    let pq = new PriorityQueue([1, 2, 3]);
    expect(pq.enqueue(0)).to.equal(4);
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('enqueue', 10);
});

describe('#entries', () => {
  it('should return an iterator', () => {
    let pq = new PriorityQueue([0, 1, 2]);

    expect(pq.entries()).to.respondTo('next');

    let it = pq.entries();
    expect(it.next()).to.have.property('value');
    it.next();
    it.next();
    expect(it.next().done).to.be.true;

  });

  it('should return an iterator which outputs key-value pairs of the elements of the priority queue, where the values are the elements exactly, not copies, in the correct order', () => {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], (a, b) => {
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

  it('should return an iterator that does not mutate the priority queue', () => {
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

  it('should return iterators which are independent of one another', () => {
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

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('entries');
});

describe('#every', () => {
  it('should return what Array.prototype.every would when none of the elements satisfy the predicate', () => {
    let predicate = element => !(element % 3);

    expect(
      (new PriorityQueue([1, 2, 4, 5])).every(predicate)
    ).to.equal(
      [1, 2, 4, 5].every(predicate)
    );
  });
  
  it('should return what Array.prototype.every would when some of the elements satisfy the predicate', () => {
    let predicate = element => !(element % 3);

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).every(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].every(predicate)
    );
  });
  
  it('should return what Array.prototype.every would when all of the elements satisfy the predicate', () => {
    let predicate = () => true;

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).every(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].every(predicate)
    );
  });

  it('should iterate through the elements the way Array.prototype.every would', () => {
    let pqIndices = [];
    (new PriorityQueue([5, 6, 7, 8, 9])).every((element, index) => {
      pqIndices.push(index);
      return element < 7;
    });

    let arrIndices = [];

    [5, 6, 7, 8, 9].every((element, index) => {
      arrIndices.push(index);
      return element < 7;
    });

    expect(pqIndices).to.deep.equal(arrIndices);

  });

  it('should return what Array.prototype.every would for an empty Array if the priority queue is empty', () => {
    expect(
      (new PriorityQueue()).every(() => { return false; })
    ).to.equal(
      [].every(() => { return false; })
    );
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('every', false);
  itShouldSetTheContextOfTheCallbackCorrectly('every', false);
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('every', () => true);
});

describe('#forEach', () => {
  it('should call the callback on each element of the priority queue in order', () => {
    let elements = [];

    (new PriorityQueue([5, 3, 4, 1, 2])).forEach((element) => {
      elements.push(element);
    });

    expect(elements).to.deep.equal([1, 2, 3, 4, 5]);
  });
  
  it('should not call the callback if the priority queue is empty', () => {
    let numberOfCalls = 0;
    (new PriorityQueue()).forEach(() => { ++numberOfCalls; });
    expect(numberOfCalls).to.equal(0);
  });

  it('should only call the callback function on the elements present in the priority queue at the time of call, even if the callback function adds elements', () => {
    let elements = [];

    (new PriorityQueue([5, 3, 4, 1, 2])).forEach((element, index, pq) => {
      pq.enqueue(10);
      elements.push(element);
    });

    expect(elements).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should call the callback function on all the elements present in the priority queue at the time of call, even if the callback function adds elements', () => {
    let elements = [];

    (new PriorityQueue([5, 3, 4, 1, 2])).forEach((element, index, pq) => {
      pq.dequeue();
      elements.push(element);
    });

    expect(elements).to.deep.equal([1, 2, 3, 4, 5]);
  });
  
  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('forEach');
  itShouldSetTheContextOfTheCallbackCorrectly('forEach');
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('forEach', () => {});
});

{
  let describeIncludesOrIndexOf = (methodName) => {
    
    describe(`#${methodName}`, () => {
      it(`should return what an empty Array's #${methodName} would return`, () => {
        expect(
          (new PriorityQueue([]))[methodName](3)
        ).to.equal(
          [][methodName](3)
        );
      });

      it(`should return what an empty Array's #${methodName} would return, with fromIndex`, () => {
        expect(
          (new PriorityQueue([]))[methodName](3, 2)
        ).to.equal(
          [][methodName](3, 2)
        );
      });
     
      it(`should return what an empty Array's #${methodName} would return, with negative fromIndex`, () => {
        expect(
          (new PriorityQueue([]))[methodName](3, -2)
        ).to.equal(
          [][methodName](3, -2)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is present`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 3, 2]))[methodName](3)
        ).to.equal(
          [2, 3, 3, 4, 5][methodName](3)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is not present`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](1)
        ).to.equal(
          [2, 3, 4, 5][methodName](1)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is present, 0 fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 3, 2]))[methodName](3, 0)
        ).to.equal(
          [2, 3, 3, 4, 5][methodName](3, 0)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is not present, 0 fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](1, 0)
        ).to.equal(
          [2, 3, 4, 5][methodName](1, 0)
        );
      });

      it(`should return what Array's #${methodName} would return where the search element is present in search segment`, () => {
        expect(
          (new PriorityQueue([5, 4, 4, 3, 2]))[methodName](4, 1)
        ).to.equal(
          [2, 3, 4, 4, 5][methodName](4, 1)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is present but not in search segment`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](2, 3)
        ).to.equal(
          [2, 3, 4, 5][methodName](2, 3)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is not present in search segment or rest of priority queue`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](1, 1)
        ).to.equal(
          [2, 3, 4, 5][methodName](1, 1)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is present in search segment, negative fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](4, -2)
        ).to.equal(
          [2, 3, 4, 5][methodName](4, -2)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is present but not in search segment, negative fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](2, -1)
        ).to.equal(
          [2, 3, 4, 5][methodName](2, -1)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is not present in search segment or rest of priority queue, negative fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](1, -1)
        ).to.equal(
          [2, 3, 4, 5][methodName](1, -1)
        );
      });

      it(`should return what Array's #${methodName} would return where the search element is NaN and is present`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2, NaN]))[methodName](NaN)
        ).to.equal(
          [2, 3, 4, 5, NaN][methodName](NaN)
        );
      });
      
      it(`should return what Array's #${methodName} would return where the search element is NaN and is not present`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2]))[methodName](NaN)
        ).to.equal(
          [2, 3, 4, 5][methodName](NaN)
        );
      }); 
      
      it(`should return what Array's #${methodName} would return where the search element is NaN and is present in search segment`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
            if (Number.isNaN(a)) return 1;
            else if (Number.isNaN(b)) return -1;
            else if (a > b) return 1;
            else if (b > a) return -1;
            else return 0 
          }))[methodName](NaN, 1)
        ).to.equal(
          [2, 3, 4, 5, NaN][methodName](NaN, 1)
        );
      }); 
      
      it(`should return what Array's #${methodName} would return where the search element is NaN and is present in search segment, negative fromIndex`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
            if (Number.isNaN(a)) return -1;
            else if (Number.isNaN(b)) return 1;
            else if (a > b) return 1;
            else if (b > a) return -1;
            else return 0 
          }))[methodName](NaN, -5)
        ).to.equal(
          [NaN, 2, 3, 4, 5][methodName](NaN, -5)
        );
      });

      it(`should return what Array's #${methodName} would return where the search element is NaN and is present but not in search segment`, () => {
        expect(
          (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
            if (Number.isNaN(a)) return -1;
            else if (Number.isNaN(b)) return 1;
            else if (a > b) return 1;
            else if (b > a) return -1;
            else return 0 
          }))[methodName](NaN, 1)
        ).to.equal(
          [NaN, 2, 3, 4, 5][methodName](NaN, 1)
        );
      });

      itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge(methodName, 10);
    });
  };

  describeIncludesOrIndexOf('includes');
  describeIncludesOrIndexOf('indexOf');
}

describe('#filter', () => {
  it('should return what Array.prototype.filter would when none of the elements satisfy the predicate', () => {
    let predicate = element => !(element % 3);

    expect(
      Array.from((new PriorityQueue([1, 2, 4, 5])).filter(predicate))
    ).to.deep.equal(
      [1, 2, 4, 5].filter(predicate)
    );
  });
  
  it('should return what Array.prototype.filter would when some of the elements satisfy the predicate', () => {
    let predicate = element => !(element % 3);

    expect(
      Array.from((new PriorityQueue([1, 2, 3, 4, 5, 6])).filter(predicate))
    ).to.deep.equal(
      [1, 2, 3, 4, 5, 6].filter(predicate)
    );
  });
  
  it('should return what Array.prototype.filter would when all of the elements satisfy the predicate', () => {
    let predicate = () => true;

    expect(
      Array.from((new PriorityQueue([1, 2, 3, 4, 5, 6])).filter(predicate))
    ).to.deep.equal(
      [1, 2, 3, 4, 5, 6].filter(predicate)
    );
  });
  
  it('should return empty priority queue if it is empty', () => {
    expect(
      (new PriorityQueue()).filter(() => { return true; }).length
    ).to.equal(0);
  });
  
  it('should iterate through the elements the way Array.prototype.filter would', () => {
    let pqEntries = [];
    (new PriorityQueue([1, 2, 3, 4, 5, 6])).filter((element, i) => {
      pqEntries.push([element, i]);
    });

    let arrEntries = [];
    [1, 2, 3, 4, 5, 6].filter((element, i) => {
      arrEntries.push([element, i]);
    });

    expect(pqEntries).to.deep.equal(arrEntries);
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('filter', true);
  itShouldSetTheContextOfTheCallbackCorrectly('filter', true);
  itShouldRespectSpecies('filter', () => { return true; });
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('filter', () => true);
});

describe('#join', () => {
  it('should join the elements of the priority queue in sorted order', () => {
    expect((new PriorityQueue(['z', 'y', 'x'])).join()).to.equal(['x', 'y', 'z'].join());
  });
  
  it('should join the elements of the priority queue in sorted order, with separator', () => {
    expect((new PriorityQueue(['z', 'y', 'x'])).join('::')).to.equal(['x', 'y', 'z'].join('::'));
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('join', ',');
});

{ 
  let describeFindMethod = (methodName) => {
    describe(`#${methodName}`, () => {
      it('should find the same element that Array would find, the elements being iterated over in sorted order', () => {
        let predicate = element => element === 'x' || element === 'y';

        let pq = new PriorityQueue(
          [ 
            { value: 'z' }, 
            { value: 'y' }, 
            { value: 'x' }, 
            { value: 'w' }
          ], (a, b) => {
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
      
      it(`should return what Array.prototype.${methodName} would return if the element is not found`, () => {
        let predicate = element =>element === 'q';

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](predicate)
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](predicate)
        );
      });
      
      it(`should return what Array.prototype.${methodName} for an empty array if the priority queue is empty`, () => {
        let predicate = element => element === 'q';

        let pq = new PriorityQueue();

        expect(
          pq[methodName](predicate)
        ).to.equal(
          [][methodName](predicate)
        );
      });     
     
      it(`should call the callback function passing an index the way that Array.prototype.${methodName} would`, () => {
        let indices = [];
        let predicate = (element, index) => {
          indices.push(index);
          return element === 'y';
        };

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);
        pq[methodName](predicate);
        let pqIndices = [...indices];

        indices = [];
        ['w', 'x', 'y', 'z'][methodName](predicate);
        let arrIndices = [...indices];

        expect(pqIndices).to.deep.equal(arrIndices);
      });

      it('should iterate through all elements of the priority queue that were there at the time of call, even if the callback removes elements from the original priority queue', () => {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName]((element) => {
          elements.push(element);
          pq.dequeue();
        });

        expect(elements.reduce((accumulator, element) => { return accumulator + element; }, 0)).to.equal(55);

      });
      
      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds elements to the original priority queue', () => {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName]((element, index) => {
          elements.push(element);
          pq.enqueue(index + 1);
          pq.enqueue(index + 2);
        });

        expect(elements.reduce((accumulator, element) => { return accumulator + element; }, 0)).to.equal(55);

      });

      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds and removes elements to and from the original priority queue', () => {
        let pq = new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        let elements = [];
        pq[methodName]((element, index) => {
          elements.push(element);
          pq.enqueue(pq.dequeue() + 1);
        });

        expect(elements.reduce((accumulator, element) => { return accumulator + element; }, 0)).to.equal(55);
      
      });

      itShouldPassTheOriginalPriorityQueueToTheCallbackFunction(methodName, false);
      itShouldSetTheContextOfTheCallbackCorrectly(methodName, false);
      itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge(methodName, () => false);
    });
  };
  
  describeFindMethod('find');
  describeFindMethod('findIndex');
}

describe('#lastIndexOf', () => {
  it("should return what an empty Array's #lastIndexOf would return", () => {
    expect(
      (new PriorityQueue([])).lastIndexOf(3)
    ).to.equal(
      [].lastIndexOf(3)
    );
  });

  it("should return what an empty Array's #lastIndexOf would return, with fromIndex", () => {
    expect(
      (new PriorityQueue([])).lastIndexOf(3, 2)
    ).to.equal(
      [].lastIndexOf(3, 2)
    );
  });
 
  it("should return what an empty Array's #lastIndexOf would return, with negative fromIndex", () => {
    expect(
      (new PriorityQueue([])).lastIndexOf(3, -2)
    ).to.equal(
      [].lastIndexOf(3, -2)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is present", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 3, 2])).lastIndexOf(3)
    ).to.equal(
      [2, 3, 3, 4, 5].lastIndexOf(3)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is not present", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(1)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(1)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is present, fromIndex last element", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(3, 3)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(3, 3)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is not present, fromIndex last element", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(1, 3)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(1, 3)
    );
  });

  it("should return what Array's #lastIndexOf would return where the search element is present in search segment", () => {
    expect(
      (new PriorityQueue([5, 4, 4, 3, 2])).lastIndexOf(4, 3)
    ).to.equal(
      [2, 3, 4, 4, 5].lastIndexOf(4, 3)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is present but not in search segment", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(4, 1)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(4, 1)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is not present in search segment or rest of priority queue", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(1, 2)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(1, 2)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is present in search segment, negative fromIndex", () => {
    expect(
      (new PriorityQueue([6, 5, 4, 4, 3, 2])).lastIndexOf(4, -2)
    ).to.equal(
      [2, 3, 4, 4, 5, 5].lastIndexOf(4, -2)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is present but not in search segment, negative fromIndex", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(5, -2)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(5, -2)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is not present in search segment or rest of priority queue, negative fromIndex", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(1, -2)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(1, -2)
    );
  });

  it("should return what Array's #lastIndexOf would return where the search element is NaN and is present", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN])).lastIndexOf(NaN)
    ).to.equal(
      [2, 3, 4, 5, NaN].lastIndexOf(NaN)
    );
  });
  
  it("should return what Array's #lastIndexOf would return where the search element is NaN and is not present", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2])).lastIndexOf(NaN)
    ).to.equal(
      [2, 3, 4, 5].lastIndexOf(NaN)
    );
  }); 
  
  it("should return what Array's #lastIndexOf would return where the search element is NaN and is present in search segment", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
        if (Number.isNaN(a)) return 1;
        else if (Number.isNaN(b)) return -1;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).lastIndexOf(NaN, 4)
    ).to.equal(
      [2, 3, 4, 5, NaN].lastIndexOf(NaN, 4)
    );
  }); 
  
  it("should return what Array's #lastIndexOf would return where the search element is NaN and is present in search segment, negative fromIndex", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
        if (Number.isNaN(a)) return -1;
        else if (Number.isNaN(b)) return 1;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).lastIndexOf(NaN, -2)
    ).to.equal(
      [NaN, 2, 3, 4, 5].lastIndexOf(NaN, -2)
    );
  });

  it("should return what Array's #lastIndexOf would return where the search element is NaN and is present but not in search segment", () => {
    expect(
      (new PriorityQueue([5, 4, 3, 2, NaN], (a, b) => {
        if (Number.isNaN(a)) return 1;
        else if (Number.isNaN(b)) return -11;
        else if (a > b) return 1;
        else if (b > a) return -1;
        else return 0 
      })).lastIndexOf(NaN, -2)
    ).to.equal(
      [2, 3, 4, 5, NaN].lastIndexOf(NaN, -2)
    );
  }); 

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('lastIndexOf', 10);
});

describe('#map', () => {
  it('should return an Array', () => {
    expect((new PriorityQueue(
      [
        5, 
        4, 
        3, 
        2, 
        1,
      ]
    )).map((element) => { return element; })).to.be.an('array');
  });

  it('should return what Array.prototype.map would', () => {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    let callback = (element) => {
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

  it('should return what Array.prototype.map would when the priority queue is empty', () => {
    let pq = new PriorityQueue();

    let callback = (element) => {
      return { value: element };
    };

    expect(pq.map(callback)).to.deep.equal([].map(callback));
  });

  it('should disregard elements which are enqueued in the callback', () => {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    expect(pq.map((element) => {
      pq.enqueue(10);
      return element;
    })).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should map elements even if they are dequeued in the callback', () => {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);
    expect(pq.map((element) => {
      pq.dequeue();
      return element;
    })).to.deep.equal([1, 2, 3, 4, 5]);
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('map');
  itShouldSetTheContextOfTheCallbackCorrectly('map');
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('map', () => 10);
});

describe('#length', () => {
  it('should be correct for a zero-length priority queue', () => {
    expect((new PriorityQueue()).length).to.equal(0);
  });

  it('should increment correctly from a zero-length priority queue', () => {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    expect(pq.length).to.equal(1);
  });

  it('should increment correctly from non-zero-length priority queue more than once', () => {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    expect(pq.length).to.equal(2);
  });

  it('should increment correctly if duplicate element is enqueued', () => {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    pq.enqueue(0);
    pq.enqueue(-1);
    pq.enqueue(0);
    expect(pq.length).to.equal(5);
  });

  it('should be correct for a priority queue with initial elements', () => {
    expect((new PriorityQueue([3, 3, 1])).length).to.equal(3);
  });

  it('should increment correctly from priority queue with inital elements', () => {
    let pq = new PriorityQueue([3, 3, 1]);
    pq.enqueue(4);
    expect(pq.length).to.equal(4);
  });
 
  it('should not decrement to less than zero', () => {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(3);
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  }); 
  
  it('should not decrement to less than zero on a zero-length priority queue' , () => {
    let pq = new PriorityQueue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  });

  it('should not decrement to less than zero on a priority queue with initial elements', () => {
    let pq = new PriorityQueue([3, 2, 1]);
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    pq.dequeue();
    expect(pq.length).to.equal(0);
  });

  it('should decrement correctly to a non-zero value', () => {
    let pq = new PriorityQueue();
    pq.enqueue(2);
    pq.enqueue(1);
    pq.enqueue(0);
    pq.enqueue(-1);
    pq.enqueue(0);
    pq.dequeue();
    expect(pq.length).to.equal(4);
  });

  it('should decrement correctly for a priority queue with initial elements', () => {
    let pq = new PriorityQueue([3, 3, 1]);
    pq.dequeue();
    expect(pq.length).to.equal(2);
  });

  it('should increment correctly when removing duplicate element', () => {
    let pq = new PriorityQueue([1, 1, 1, 2, 3]);
    pq.dequeue();
    expect(pq.length).to.equal(4);
  });

  it('should not throw an exception if the priority queue is very large (issue #10)', () => {
    const pq = new PriorityQueue();

    for (const i of BIG_ARRAY) pq.enqueue(i);

    expect(() => pq.length).to.not.throw();
  });
});

describe('#peak', () => {

  it('should return exactly the head element for a priority queue', () => {

    let pq = new PriorityQueue([], (a, b) => {
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

  it('should return exactly the head element for a priority queue with initial elements', () => {

    let head = { value: 1 }; 
    let pq = new PriorityQueue([
      { value: 2 },
      { value: 3 },
      head,
    ], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
    
    expect(pq.peek()).to.equal(head); 
  });

  it('should not mutate the priority queue', () => {
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

  it('should return exactly the element at the specified positive index', () => {

    let pq = new PriorityQueue([], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
   

    let element = { value: 2 }; 
    pq.enqueue({ value: 1 });
    pq.enqueue(element);
    pq.enqueue({ value: 4 });
    pq.enqueue({ value: 3 });
    
    expect(pq.peek(1)).to.equal(element); 
  });

  it('should return exactly the element at the specified positive index for a priority queue with initial elements', () => {

    let element = { value: 2 }; 
    let pq = new PriorityQueue([
      { value: 1 },
      { value: 3 },
      { value: 4 },
      element,
    ], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
    
    expect(pq.peek(1)).to.equal(element); 
  });

  it('should not mutate the priority queue when a positive index is specified', () => {
    let pq = new PriorityQueue();
    pq.enqueue(1);
    pq.enqueue(2);
    pq.enqueue(3);
    pq.peek(2);

    expect(pq.length).to.equal(3);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3]);
    
  });
  
  it('should return exactly the element at the specified negative index', () => {

    let pq = new PriorityQueue([], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
   

    let element = { value: 2 }; 
    pq.enqueue({ value: 1 });
    pq.enqueue(element);
    pq.enqueue({ value: 4 });
    pq.enqueue({ value: 3 });
    
    expect(pq.peek(-3)).to.equal(element); 
  });

  it('should return exactly the element at the specified negative index for a priority queue with initial elements', () => {

    let element = { value: 2 }; 
    let pq = new PriorityQueue([
      { value: 1 },
      { value: 3 },
      { value: 4 },
      element,
    ], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });
    
    expect(pq.peek(-3)).to.equal(element); 
  });

  it('should not mutate the priority queue when a negative index is specified', () => {
    let pq = new PriorityQueue();
    pq.enqueue(1);
    pq.enqueue(2);
    pq.enqueue(3);
    pq.peek(-1);

    expect(pq.length).to.equal(3);
    expect([
      pq.dequeue(),
      pq.dequeue(),
      pq.dequeue(),
    ]).to.deep.equal([1, 2, 3]);
  });

  it('should return undefined for an empty priority queue', () => {
    expect((new PriorityQueue()).peek()).to.be.undefined;
  });

  it('should return undefined if element at specified positive index does not exist', () => {
    expect((new PriorityQueue([1, 2, 3])).peek(10)).to.be.undefined;
  });
  
  it('should return undefined if element at specified negative index does not exist', () => {
    expect((new PriorityQueue([1, 2, 3])).peek(-10)).to.be.undefined;
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('peek');
});

{ 
  let describeReduceMethod = (methodName) => {
    describe(`#${methodName}`, () => {
      it('should reduce in the same manner that an Array reduces, the elements being iterated over in sorted order', () => {
        let concatReduce = (accumulator, currentValue) => accumulator + currentValue;

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](concatReduce, '')
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](concatReduce, '')
        );
      });

      it('should reduce an empty priority queue in the same manner that an Array reduces an empty Array', () => {
        let concatReduce = (accumulator, currentValue) => accumulator + currentValue;

        let pq = new PriorityQueue();

        expect(
          pq[methodName](concatReduce, 'a')
        ).to.equal(
          [][methodName](concatReduce, 'a')
        );
      });

      it('should call the callback function passing an index the way that Array.prototype.reduce would', () => {
        let indexReduce = (accumulator, currentValue, currentIndex) => [accumulator, currentIndex].join(',');

        let pq = new PriorityQueue(['z', 'y', 'x', 'w']);

        expect(
          pq[methodName](indexReduce, '')
        ).to.equal(
          ['w', 'x', 'y', 'z'][methodName](indexReduce, '')
        );
      });

      it('should pass the original priority queue to the callback function', () => {
        let pq = new PriorityQueue([5, 4, 3, 2, 1]);
        pq[methodName]((accumulator, currentValue, currentIndex, pqReference) => {
          expect(pqReference).to.equal(pq);
        });
      });

      it('should iterate through all elements of the priority queue that were there at the time of call, even if the callback removes elements from the original priority queue', () => {
        expect(
          (new PriorityQueue([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))[methodName](
            (accumulator, currentValue, currentIndex, pq) => {
              pq.dequeue();
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(55);
      });
      
      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds elements to the original priority queue', () => {
        expect(
          (new PriorityQueue([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]))[methodName](
            (accumulator, currentValue, currentIndex, pq) => {
              pq.enqueue(currentIndex + 1);
              pq.enqueue(currentIndex + 2);
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(65);
      });

      it('should only iterate through the elements of the priority queue that were there at the time of call, even if the callback adds and removes elements to and from the original priority queue', () => {
        expect(
          (new PriorityQueue([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]))[methodName](
            (accumulator, currentValue, currentIndex, pq) => {
              pq.enqueue(pq.dequeue() + 1);
              return accumulator + currentValue;
            },
            0
          )
        ).to.equal(65);
      });

      itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge(methodName, () => 10);
    });
  };

  describeReduceMethod('reduce');
  describeReduceMethod('reduceRight');
}

describe('#slice', () => {
  it('should return what Array.prototype.slice would return, with no arguments', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice())
    ).to.deep.equal([1, 2, 3, 4, 5].slice());
  });
  
  it('should return what Array.prototype.slice would return, with a positive begin argument', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(2));
  });
  
  it('should return what Array.prototype.slice would return, with a negative begin argument', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(-2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(-2));
  }); 
  
  it('should return what Array.prototype.slice would return, with a positive begin argument out of range', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(10))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(10));
  }); 
  
  it('should return what Array.prototype.slice would return, with a negative begin argument out of range', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(-10))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(-10));
  });
  
  it('should return what Array.prototype.slice would return, with a positive end argument', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(1, 3))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(1, 3));
  });
  
  it('should return what Array.prototype.slice would return, with a negative end argument', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(1, -2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(1, -2));
  }); 
  
  it('should return what Array.prototype.slice would return, with a positive end argument out of range', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(1, 10))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(1, 10));
  }); 
  
  it('should return what Array.prototype.slice would return, with a negative end argument out of range', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(1, -10))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(1, -10));
  });

  it('should return what Array.prototype.slice would return, where the begin and end arguments are the same and positive', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(2, 2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(2, 2));
  });
  
  it('should return what Array.prototype.slice would return, where the begin and end arguments are the same and negative', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(-2, -2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(2, 2));
  });
  
  it('should return what Array.prototype.slice would return, where the begin index is after the end index and both arguments are positive', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(4, 2))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(4, 2));
  }); 
  
  it('should return what Array.prototype.slice would return, where the begin index is after the end index and both arguments are negative', () => {
    expect(
      Array.from((new PriorityQueue([5, 4, 3, 2, 1])).slice(-2, -4))
    ).to.deep.equal([1, 2, 3, 4, 5].slice(-2, -4));
  });  
  
  itShouldRespectSpecies('slice');
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('slice');
});

describe('#some', () => {
  it('should return what Array.prototype.some would when none of the elements satisfy the predicate', () => {
    let predicate = element => !(element % 3);

    expect(
      (new PriorityQueue([1, 2, 4, 5])).some(predicate)
    ).to.equal(
      [1, 2, 4, 5].some(predicate)
    );
  });
  
  it('should return what Array.prototype.some would when some of the elements satisfy the predicate', () => {
    let predicate = (element) => !(element % 3);

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).some(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].some(predicate)
    );
  });
  
  it('should return what Array.prototype.some would when all of the elements satisfy the predicate', () => {
    let predicate = () => true;

    expect(
      (new PriorityQueue([1, 2, 3, 4, 5, 6])).some(predicate)
    ).to.equal(
      [1, 2, 3, 4, 5, 6].some(predicate)
    );
  });

  it('should iterate through the elements the way Array.prototype.some would', () => {
    let pqIndices = [];
    (new PriorityQueue([5, 6, 7, 8, 9])).some((element, index) => {
      pqIndices.push(index);
      return element === 7;
    });

    let arrIndices = [];

    [5, 6, 7, 8, 9].some((element, index) => {
      arrIndices.push(index);
      return element === 7;
    });

    expect(pqIndices).to.deep.equal(arrIndices);

  });

  it('should return what Array.prototype.some would for an empty Array if the priority queue is empty', () => {
    expect(
      (new PriorityQueue()).some(() => { return false; })
    ).to.equal(
      [].some(() => { return false; })
    );
  });

  itShouldPassTheOriginalPriorityQueueToTheCallbackFunction('some', false);
  itShouldSetTheContextOfTheCallbackCorrectly('some', false);
  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('some', () => false);

});

describe('#toLocaleString', () => { 
  it('should return the same as #toLocaleString of a sorted Array for a priority queue', () => {
    let pq = new PriorityQueue([], (a, b) => {
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
  
  it('should return the same as #toLocaleString of a sorted Array for a priority queue with initial values', () => {
    expect(
      (new PriorityQueue([
        new Date(4), 
        new Date(3), 
        new Date(2), 
        new Date(1),
      ], (a, b) => {
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

  it('should return the same as #toLocaleString of an empty Array when the priority queue is empty', () => {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect((new PriorityQueue()).toLocaleString()).to.equal(([]).toLocaleString());
  });

  it('should return the same as #toLocaleString of an empty Array when the priority queue is empty and in its initial state', () => {
    expect((new PriorityQueue()).toLocaleString()).to.equal(([]).toLocaleString());
  }); 

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('toLocaleString')
});

describe('#toString', () => {
  it('should return the same as #toString of a sorted Array for a priority queue', () => {
    let pq = new PriorityQueue();
    pq.enqueue(4);
    pq.enqueue(3);
    pq.enqueue(2);
    pq.enqueue(1);
    expect(pq.toString()).to.equal(([1, 2, 3, 4]).toString());
  });
  
  it('should return the same as #toString of a sorted Array for a priority queue with initial values', () => {
    expect((new PriorityQueue([4, 3, 2, 1])).toString()).to.equal(([1, 2, 3, 4]).toString());
  });

  it('should return the same as #toString of an empty Array when the priority queue is empty', () => {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect((new PriorityQueue()).toString()).to.equal(([]).toString());
  });

  it('should return the same as #toString of an empty Array when the priority queue is empty and in its initial state', () => {
    expect((new PriorityQueue()).toString()).to.equal(([]).toString());
  });  

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('toString');
});

describe('#values', () => {
  it('should return an iterator', () => {
    let pq = new PriorityQueue([0, 1, 2]);

    expect(pq.values()).to.respondTo('next');

    let it = pq.values();
    expect(it.next()).to.have.property('value');
    it.next();
    it.next();
    expect(it.next().done).to.be.true;

  });

  it('should return an iterator which outputs the elements of the priority queue exactly, not copies, in the correct order', () => {
    let pq = new PriorityQueue([
      { value: 5 },
      { value: 4 },
    ], (a, b) => {
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

  it('should return an iterator that does not mutate the priority queue', () => {
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

  it('should return iterators which are independent of one another', () => {
    let pq = new PriorityQueue([5, 4, 3, 2, 1]);

    let it0 = pq.values();
    let it1 = pq.values();

    expect([...it0, ...it1]).to.deep.equal([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
  });

  itShouldNotThrowAnExceptionIfThePriorityQueueIsVeryLarge('values');
});



describe('JSON.stringify', () => {
  it('should return the same as JSON.stringify([]) when the priority queue is empty', () => {
    let pq = new PriorityQueue([1]);
    pq.dequeue();
    expect(JSON.stringify(new PriorityQueue())).to.equal(JSON.stringify([]));
  });

  it('should return the same as JSON.stringify([]) when the priority queue is empty and in its initial state', () => {
    expect(JSON.stringify(new PriorityQueue())).to.equal(JSON.stringify([]));
  });

  it('should return the same as JSON.stringify of a sorted array of the elements of the priority queue', () => {
    let pq = new PriorityQueue([], (a, b) => {
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
  
  it('should return the same as JSON.stringify of a sorted array of the elements of the priority queue where the elements have a toJSON method defined', () => {
    let pq = new PriorityQueue([], (a, b) => {
      if (a.value > b.value) return 1;
      else if (a.value < b.value) return -1;
      else return 0;
    });

    pq.enqueue({ 
      value: 4,
      toJSON: () => { return 'd'; },
    });
    pq.enqueue({ 
      value: 3 ,
      toJSON: () => { return 'c'; },
    });
    pq.enqueue({ 
      value: 2,
      toJSON: () => { return 'b' },
    });
    pq.enqueue({ 
      value: 1,
      toJSON: () => { return 'a' },
    });

    expect(JSON.stringify(pq)).to.deep.equal(JSON.stringify(['a', 'b', 'c', 'd']));
  });

  it('should not throw an exception if the priority queue is very large (issue #10)', () => {
    const pq = new PriorityQueue();

    for (const i of BIG_ARRAY) pq.enqueue(i);

    expect(() => JSON.stringify(pq)).to.not.throw();
  });
});
