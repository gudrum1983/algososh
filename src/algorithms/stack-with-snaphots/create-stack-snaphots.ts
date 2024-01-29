import {TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";

export interface IStackWithSnapshots<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  getSize: () => number;
  saveHistory: () => void;
  getHistory: () => Array<Array<T>>;
  changeLast: (item: T) => void;
  clearAll: () => void;
}

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