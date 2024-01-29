export interface IQueueWithSnapshots<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  peakLast: () => T | null;
  changeFirst: (item: T) => void;
  getSize: () => number;
  getLength: () => number;
  saveHistory: () => void;
  getHistory: () => Array<TNewSnapQueue<T>> | null;
  changeLast: (item: T) => void;
  clear: () => void;
  getCanAdd: () => boolean;
  getCanDelete: () => boolean;
}

export type TNewSnapQueue<T> = {
  containerQueue: Array<T | null>,
  head: number;
  tail: number;
  size: number;
  length: number,
  elementPointer: number | null;
  newElement: T | null;
  removeElement: T | null;
}


export class QueueWithSnapshots<T> implements IQueueWithSnapshots<T> {
  private containerQueue: Array<T | null> = [];
  private head: number = 0;
  private tail: number = 0;
  private readonly size: number = 0;
  private length: number = 0;
  private snapshots: Array<TNewSnapQueue<T>> = [];
  private elementPointer: number | null;
  private removeElement: T | null;
  private newElement: T | null;


  constructor(size: number = 0, data?: Array<T>) {
    if (data) {
      this.size = size || data.length;
      data.forEach(item => this.enqueue(item));
    } else {
      this.size = size;
      this.containerQueue = Array(this.size);
    }


    this.elementPointer = null;         // выделение одного активного элемента
    this.newElement = null;             // новый элемент в массиве - зелёный
    this.removeElement = null;          // удаляемый элемент
    this.snapshots = []                 // снимки

    this.saveHistory()
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    } else {
      this.elementPointer = this.tail
      this.saveHistory()
      this.elementPointer = null
      this.containerQueue[this.tail] = item;
      this.tail++;
      this.length++;
      this.saveHistory()
    }
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else {
      this.elementPointer = this.head;
      this.saveHistory();
      this.elementPointer = null;
      this.containerQueue[this.head] = null;

      (this.head !== this.size - 1) && this.head++;
      this.length--;
      this.saveHistory();
    }
  };


  peakLast = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.containerQueue[this.tail - 1]) {
      return this.containerQueue[this.tail - 1]
    }
    return null;
  };


  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.containerQueue[this.head]) {
      return this.containerQueue[this.head]
    }
    return null;
  };

  clear = () => {
    this.containerQueue = Array(this.size);
    this.head = 0;
    this.tail = 0;
    this.length = 0;
    this.saveHistory()
  };

  isEmpty = () => this.length === 0;

  changeLast = (item: T): void => {

    const lastInd = (this.tail === 0 && this.length > 0) ? this.size - 1 : this.tail - 1
    this.containerQueue[lastInd] = item
  }

  changeFirst = (item: T): void => {
    if (this.getSize() !== 0) {
      const lastInd = this.head
      this.containerQueue[lastInd] = item
    }
  }

  getSize = () => this.containerQueue.length;
  getLength = () => this.length;

  getCanAdd = () => (this.size === this.tail)

  getCanDelete = () => (this.length !== 0)

  saveHistory() {
    this.snapshots.push({
      head: this.head,
      tail: this.tail,
      length: this.length,
      size: this.size,
      elementPointer: this.elementPointer,
      removeElement: this.removeElement,
      newElement: this.newElement,
      containerQueue: [...this.containerQueue]
    })
  }

  clearHistory() {
    this.snapshots = []
  }

  clearAll() {
    this.snapshots = []
    this.containerQueue = this.containerQueue = Array(this.size);
  }

  getHistory() {
    const temp = [...this.snapshots]
    this.clearHistory()
    return temp
  }
}