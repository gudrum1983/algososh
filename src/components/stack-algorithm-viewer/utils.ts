import {ISnapshotStorage, ISnapshot} from "../../types/snapshots";

export interface IStackState<T> {
  container: Array<T>;
  size: number;
  tailIndex: number | null;
  activeIndex: number | null;
}

interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  clearAll: () => void;
  save: () => ISnapshot<IStackState<T>>;
}

export class Stack<T> implements IStack<T> {
  private container: Array<T> = [];
  private size: number = 0;
  private tailIndex: number | null = null;
  private activeIndex: number | null = null;
  private backup?: () => void;

  private getContainerLength = () => this.container.length;

  private toArray(): Array<T> {
    return [...this.container];
  }

  getSize = () => this.size;

  public save(): ISnapshot<IStackState<T>> {
    return new StackSnapshot<T>({
      container: this.toArray(),
      size: this.size,
      tailIndex: this.tailIndex,
      activeIndex: this.activeIndex,
    });
  }

  push = (item: T): void => {
    if (this.backup) {
      this.container.push(item)
      this.size = this.getContainerLength()
      this.tailIndex = this.activeIndex = this.size - 1
      this.backup();
      this.activeIndex = null;
      this.backup();
    }

  };

  pop = (): void => {
    if (this.getSize() !== 0 && this.backup) {
      this.activeIndex = this.tailIndex;
      this.backup();
      this.container.pop()
      this.size = this.getContainerLength();
      this.tailIndex = this.size - 1;
      this.backup();
    }
  };

  clearAll() {
    if (this.backup) {
      this.container = [];
      this.backup();
    }
  }

  setBackup(backup: () => void) {
    this.backup = () => backup()
  }

}

export class StackSnapshot<T> implements ISnapshot<IStackState<T>> {
  private readonly state: IStackState<T> = {
    container: [],
    size: 0,
    tailIndex: null,
    activeIndex: null,
  };

  constructor({container, size, tailIndex, activeIndex}: IStackState<T>) {
    this.state = {container, size, tailIndex, activeIndex}
  }

  public getState(): IStackState<T> {
    return this.state;
  }
}

export class StackSnapshotStorage<T> implements ISnapshotStorage<ISnapshot<IStackState<T>>> {

  private snapshots: Array<ISnapshot<IStackState<T>> | null> = [];
  private originator: IStack<T>;
  private head: number = 0;
  private length: number = 0;

  constructor(originator: IStack<T>) {
    this.originator = originator;
  }

  isEmpty = () => this.length === 0;

  createAndStoreSnapshot(): void {
    const newSnapshot: ISnapshot<IStackState<T>> = this.originator.save()
    this.snapshots.push(newSnapshot);
    this.length++;
  }

  retrieveAndRemoveSnapshot = (): ISnapshot<IStackState<T>> | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the QueueCaretaker");
    } else if (this.snapshots[this.head]) {
      const currentSnapshot = this.snapshots[this.head]
      this.snapshots[this.head] = null;
      this.head++;
      this.length--;
      return currentSnapshot
    }
    return null;
  };

  clear = () => {
    this.snapshots = [];
    this.head = 0;
    this.length = 0;
  };
}