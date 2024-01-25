import {ElementStates} from "../../types/element-states";
import {createQueueItem, TElementQueue1} from "../../utils/utils";

export interface IQueueWithSnapshots<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  peakLast: () => T | null;
  changeFirst: (item: T) => void;
  getSize: () => number;
  getLength: () => number;
  saveHistory: () => void;
  getHistory: () => Array<TNewSnap<T>> | null;
  changeLast: (item: T) => void;
  clear: () => void;
  getCanAdd: () => boolean;
  getCanDelete: () => boolean;
}

export function createQueneSnaphotsPush(stack: IQueueWithSnapshots<TElementQueue1>, value: string) {


  //если очередь есть = надо заменить на другое???
  if (stack) {

    const lengthQueue = stack.getLength()

    const newItem = createQueueItem({letter: value, state: ElementStates.Changing})

    stack.enqueue(newItem)
    stack.saveHistory()

    if (newItem && newItem.state) {
      const item = {...newItem, state: ElementStates.Default}
      stack.changeLast(item)
    }

    stack.saveHistory()

  }
}

export function createQueueSnaphotsPop(stack: IQueueWithSnapshots<TElementQueue1>) {

  if (stack) {

    const lenghtQueue = stack.getLength()
    if (lenghtQueue <= 0) {
      return
    }

    const first = stack.peak()

    if (first && first.state) {
      first.state = ElementStates.Changing
      stack.saveHistory()
    }

    stack.dequeue()

    stack.saveHistory()
  }
}

export function initialState(Queue1: IQueueWithSnapshots<TElementQueue1>) {
  Queue1.saveHistory()

}

export function createGueueSnaphotsClear(stack: IQueueWithSnapshots<TElementQueue1>) {

  if (stack) {

    const size = stack.getSize()

    if (size > 0) {

      stack.clear()

    }

  }
}


export type TNewSnap<T> = {
  container: Array<T | null>,
  head: number;
  tail: number;
  size: number;
  length: number,
}


export class QueueWithSnapshots<T> implements IQueueWithSnapshots<T> {
  private container: Array<T | null> = [];
  private head: number = 0;
  private tail: number = 0;
  private readonly size: number = 0;
  private length: number = 0;
  private snapshots: Array<TNewSnap<T>> = [];

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
      this.tail++;
      this.length++;
    }
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else {
      this.container[this.head] = null;
      (this.head !== this.size - 1) && this.head++;
      this.length--;
    }
  };


  peakLast = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.container[this.tail - 1]) {
      return this.container[this.tail - 1]
    }
    return null;
  };


  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.container[this.head]) {
      return this.container[this.head]
    }
    return null;
  };

  clear = () => {
    this.container = Array(this.size);
    this.head = 0;
    this.tail = 0;
    this.length = 0;
    this.saveHistory()
  };

  isEmpty = () => this.length === 0;

  changeLast = (item: T): void => {

    const lastInd = (this.tail === 0 && this.length > 0) ? this.size - 1 : this.tail - 1
    this.container[lastInd] = item
  }

  changeFirst = (item: T): void => {
    if (this.getSize() !== 0) {
      const lastInd = this.head
      this.container[lastInd] = item
    }
  }

  getSize = () => this.container.length;
  getLength = () => this.length;

  getCanAdd = () => (this.size === this.tail)

  getCanDelete = () => (this.length !== 0)

  saveHistory() {
    this.snapshots.push({head: this.head, tail: this.tail, length: this.length, size:this.size, container: [...this.container]})
  }

  clearHistory() {
    this.snapshots = []
  }

  clearAll() {
    this.snapshots = []
    this.container = this.container = Array(this.size);
  }

  getHistory() {
    const temp = [...this.snapshots]
    this.clearHistory()
    return temp
  }


}