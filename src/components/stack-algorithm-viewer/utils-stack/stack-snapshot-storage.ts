import {ISnapshot, ISnapshotStorage} from "../../../types/snapshots";
import {IStack, IStackState} from "./stack";

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