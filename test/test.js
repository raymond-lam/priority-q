import PriorityQueue from "../src/priority-queue";
import { expect } from 'chai';

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

describe('iterator', function() {
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
