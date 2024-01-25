import {TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";
import {ElementStates} from "../../types/element-states";
import {createQueueItem, createStackItem, TElementQueue1} from "../../utils/utils";

import {IQueue} from "../../utils/queue";
import {StackWithSnapshots} from "../create-stack-snaphots/create-stack-snaphots";


export interface IQueueWithSnapshots<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  peakLast: () => T | null;
  getSize: () => number;
  getLength: () => number;
  saveHistory: () => void;
  getHistory: () => TSnapshotsList<T | null>;
  changeLast: (item: T) => void;
  clearAll: () => void;
}

export function createQueneSnaphotsPush(stack: IQueueWithSnapshots<TElementQueue1>, value: string) {




  //если очередь есть = надо заменить на другое???
  if (stack) {

    const index = stack.getLength()

    const newItem = createQueueItem({letter:value, state:ElementStates.Changing, index:index, tail:true})


    if (index > 0) {
      
      const topElement = stack.peakLast()

      if (topElement && topElement.tail) {

        topElement.tail = false
      }
    }

    if (index === 0) {
      newItem.head = true
      stack.enqueue(newItem)
    } else {

      stack.enqueue(newItem)
    }


    stack.saveHistory()
    const currElement = stack.peak()

    if (newItem && newItem.state) {

      const item = {...newItem, state: ElementStates.Default}
      stack.changeLast(item)
    }

    stack.saveHistory()

  }
}

export function createStackSnaphotsPop(stack: IQueueWithSnapshots<TElementQueue1>) {

  if (stack) {

    const index = stack.getSize() - 1
    if (index < 0) {
      return
    }

    const last = stack.peak()

    if (last && last.state) {

      const item = {...last, state: ElementStates.Changing}
      stack.changeLast(item)
      stack.saveHistory()
    }

    stack.dequeue()

    const currElement = stack.peak()

    if (currElement && currElement.state) {

      const item = {...currElement, top: true}

      stack.changeLast(item)

    }

    stack.saveHistory()
  }
}

export function initialState(Queue1:IQueueWithSnapshots<TElementQueue1>){
  Queue1.saveHistory()

}
export function createStackSnaphotsClear(stack: IQueueWithSnapshots<TElementQueue1>) {

  if (stack) {

    const size = stack.getSize()

    if (size > 0) {

      stack.clearAll()

    }

}}

export class QueueWithSnapshots<T> implements IQueueWithSnapshots<T> {
  private container: TSnapshot<T | null> = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;
  private snapshots: TSnapshotsList<T | null> = [];

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


  peakLast = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.container[this.tail - 1]){
      return this.container[this.tail - 1]
    }
    return null ;
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

  changeLast = (item: T): void => {
    if (this.getSize() !== 0) {
      const lastInd = this.getLength() - 1
      this.container[lastInd] = item
    }
  }

  getSize = () => this.container.length;
  getLength = () => this.length;


  saveHistory() {

    this.snapshots.push([...this.container])

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