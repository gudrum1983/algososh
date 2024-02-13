import {ISnapshot} from "../types/snapshots";

export interface ISimpleContent<T> {
  getState: () => T;
  setState: (state: T) => void;
  save: () => SimpleSnapshot<T>;
  restore: (snapshot: T) => void;
}

export class SimpleContent<T> implements ISimpleContent<T> {
  private state: T;

  constructor(state: T) {
    this.state = state;
  }

  getState():T {
    return this.state
  };

  setState(state: T): void {
    this.state = state
  }

  save(): SimpleSnapshot<T> {
    return new SimpleSnapshot<T>(this.state)
  }

  restore(snapshot: T): void {
    this.state = snapshot;
  }
}


//T - это массив Array<ICircleComponent>
export class SimpleSnapshot<T> implements ISnapshot<T> {
  private readonly state: T;

  constructor(state: T) {
    this.state = state;
  }

  public getState(): T {
    return this.state;
  }
}

export interface ISimpleSnapshotStorage {
  retrieveAndRemoveSnapshot: () => void;
  createAndStoreSnapshot: () => void;
  clear: () => void;
  isEmpty: () => boolean;
}

export class SimpleSnapshotStorage<T> implements ISimpleSnapshotStorage {

  private snapshots: Array<SimpleSnapshot<T> | null> = [];
  private originator: ISimpleContent<T>;
  private head: number = 0;
  private length: number = 0;

  constructor(originator: ISimpleContent<T>) {
    this.originator = originator;
  }

  isEmpty = () => this.length === 0;

  createAndStoreSnapshot(): void {
    const newSnapshot: SimpleSnapshot<T> = this.originator.save()
    this.snapshots.push(newSnapshot);
    this.length++;
  }

  retrieveAndRemoveSnapshot = ():void => {
    if (this.isEmpty()) {
      throw new Error("No elements in the Snapshots");
    } else if (this.snapshots[this.head]) {
      const currentSnapshot = this.snapshots[this.head]
      this.snapshots[this.head] = null;
      this.head++;
      this.length--;
      currentSnapshot && this.originator.restore(currentSnapshot.getState())
    }
  };


  clear = () => {
    this.snapshots = [];
    this.head = 0;
    this.length = 0;
  };
}