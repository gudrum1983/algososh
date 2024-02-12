import {ISnapshot, ISnapshotStorage} from "../../types/snapshots";

export interface IQueueState<T> {
  container: Array<T | null>;
  headIndex: number | null;
  tailIndex: number | null;
  size: number;
  length: number;
  activeIndex: number | null;
}

interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  getLength: () => number;
  clear: () => void;
  checkCanAdd: () => boolean;
  checkCanDelete: () => boolean;
  checkCanClear: () => boolean;
  save: () => ISnapshot<IQueueState<T>>;
}

export class Queue<T> implements IQueue<T> {
  private container: Array<T | null> = [];
  private headIndex: number | null = null;
  private tailIndex: number | null = null;
  private nextTailIndex: number | null = null;
  private readonly size: number = 0;
  private length: number = 0;
  private activeIndex: number | null = null;
  private backup?: () => void;


  constructor(size: number) {
    this.size = size;
    this.container = Array(this.size);
  }

  private toArray(): Array<T | null> {
    return [...this.container];
  }

  setBackup(backup: () => void) {
    this.backup = () => backup()
  }

  public save(): ISnapshot<IQueueState<T>> {
    return new QueueSnapshot<T>({
      container: this.toArray(),
      headIndex: this.headIndex,
      tailIndex: this.tailIndex,
      size: this.size,
      length: this.length,
      activeIndex: this.activeIndex,
    });
  }

  enqueue = (item: T) => {
    if (this.checkCanAdd()) {
      throw new Error("Maximum length exceeded");
    }
    if (!this.backup) {
      throw new Error("Queue hasn't backup");
    }

    if (this.tailIndex === null && this.headIndex === null && this.nextTailIndex === null) {
      this.tailIndex = this.headIndex = this.nextTailIndex = 0;
    }
      this.activeIndex = this.nextTailIndex
      this.container[Number(this.nextTailIndex)] = item;
      this.backup()
      this.activeIndex = null;
      this.headIndex === null && (this.headIndex = 0);
      this.tailIndex = Number(this.nextTailIndex)
      this.nextTailIndex = Number(this.nextTailIndex) + 1;
      this.length++;
      this.backup()



  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    } else if (this.backup && this.headIndex !== null) {
      this.activeIndex = this.headIndex;
      this.backup();
      this.activeIndex = null;
      this.container[this.headIndex] = null;
      (this.headIndex !== this.size - 1) && this.headIndex++;
      this.length--;
      (this.length === 0) && (this.nextTailIndex = this.headIndex);
      (this.length === 0) && (this.tailIndex = null);
      this.backup();
    }
  };

  clear = () => {
    if (this.backup) {
      this.container = Array(this.size);
      this.headIndex = null;
      this.tailIndex = null;
      this.nextTailIndex = null;
      this.length = 0;
      this.backup()
    }
  };

  isEmpty = () => this.length === 0;

  getLength = () => this.length;
  checkCanAdd = () => (this.size === this.nextTailIndex || this.headIndex === this.size - 1 )
  checkCanDelete = () => (this.length !== 0)
  checkCanClear = () => (this.headIndex !== null)


}

export class QueueSnapshot<T> implements ISnapshot<IQueueState<T>> {
  private readonly state: IQueueState<T> = {
    container: [],
    length: 0,
    size: 0,
    headIndex: 0,
    tailIndex: 0,
    activeIndex: null,
  };

  constructor({container, size, tailIndex, headIndex, activeIndex, length}: IQueueState<T>) {
    this.state = {container, size, tailIndex, headIndex, activeIndex, length}
  }

  public getState(): IQueueState<T> {
    return this.state;
  }
}

export class QueueSnapshotStorage<T> implements ISnapshotStorage<ISnapshot<IQueueState<T>>> {

  private snapshots: Array<ISnapshot<IQueueState<T>> | null> = [];
  private originator: Queue<T>;
  private head: number = 0;
  private length: number = 0;

  constructor(originator: Queue<T>) {
    this.originator = originator;
  }

  isEmpty = () => this.length === 0;

  createAndStoreSnapshot(): void {
    const newSnapshot: ISnapshot<IQueueState<T>> = this.originator.save()
    this.snapshots.push(newSnapshot);
    this.length++;
  }

  retrieveAndRemoveSnapshot = (): ISnapshot<IQueueState<T>> | null => {
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