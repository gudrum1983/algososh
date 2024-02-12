import {ISnapshot, ISnapshotStorage} from "../../../types/snapshots";
import {IQueueState, Queue} from "./queue";

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