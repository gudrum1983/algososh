import {TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";
import {ElementStates} from "../../types/element-states";
import {createStackItem} from "../../utils/utils";

import {TElementStack} from "../../components/container-stack/container-stack";

export interface IStackWithSnapshots<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  getSize: () => number;
  saveHistory: () => void;
  getHistory: () => TSnapshotsList<T>;
  changeLast: (item: T) => void;
  clearAll: () => void;
}

export function createStackSnaphotsPush(stack: IStackWithSnapshots<TElementStack>, value: string) {

  if (stack) {
    const index = stack.getSize()

    if (index > 0) {
      const topElement = stack.peak()

      if (topElement && topElement.top) {
        topElement.top = false
      }
    }


    stack.push(createStackItem(value, ElementStates.Changing, index))


    stack.saveHistory()
    const currElement = stack.peak()

    /*    stack.pop()*/


    if (currElement && currElement.state) {

      /*      currElement.state = ElementStates.Default*/
      const item = {...currElement, state: ElementStates.Default}
      stack.changeLast(item)
    }

    stack.saveHistory()

  }
}

export function createStackSnaphotsPop(stack: IStackWithSnapshots<TElementStack>) {

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

    stack.pop()

    const currElement = stack.peak()

    if (currElement && currElement.state) {

      const item = {...currElement, top: true}

      stack.changeLast(item)

    }

    stack.saveHistory()
  }
}

export function createStackSnaphotsClear(stack: IStackWithSnapshots<TElementStack>) {

  if (stack) {

    const size = stack.getSize()

    if (size > 0) {

      stack.clearAll()

    }

}}

export class StackWithSnapshots<T> implements IStackWithSnapshots<T> {
  private container: TSnapshot<T> = [];
  private snapshots: TSnapshotsList<T> = [];

  push = (item: T): void => {
    this.container.push(item)
  };

  pop = (): void => {
    if (this.getSize() !== 0) {
      this.container.pop()
    }
  };

  peak = (): T | null => {
    if (this.getSize() !== 0) {
      const lastInd = this.getSize() - 1
      return this.container[lastInd]
    }
    return null;
  };

  changeLast = (item: T): void => {
    if (this.getSize() !== 0) {
      const lastInd = this.getSize() - 1
      this.container[lastInd] = item
    }
  }

  getSize = () => this.container.length;


  saveHistory() {

    this.snapshots.push([...this.container])

  }

  clearHistory() {
    this.snapshots = []
  }

  clearAll() {
    this.snapshots = []
    this.container = []
  }

  getHistory() {

    const temp = [...this.snapshots]
    this.clearHistory()
    return temp
  }


}