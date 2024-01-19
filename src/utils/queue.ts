export interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number = 0, data?: Array<T>) {
    if (data) {
      this.size = size || data.length;
      data.forEach(item => this.enqueue(item));
    } else {
      this.size = size;
      this.container = Array(this.size);
    }
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    } else {
      this.container[this.tail] = item;
      this.tail = (this.tail + 1) % this.size;
      this.length++;
    }
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else {
      this.container[this.head] = null;
      this.head = (this.head + 1) % this.size;
      this.length--;
    }
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.container[this.head]){
      return this.container[this.head]
    }
    return null ;
  };


  clear = () => {
    this.container = Array(this.size);
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };

  isEmpty = () => this.length === 0;
}