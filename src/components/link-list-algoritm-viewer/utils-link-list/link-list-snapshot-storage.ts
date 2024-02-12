import {ISnapshot, ISnapshotStorage} from "../../../types/snapshots";
import {ILinkListState, LinkList} from "./link-list";

export class LinkListSnapshot<T> implements ISnapshot<ILinkListState<T>> {
  private readonly state: ILinkListState<T> = {
    head: null,
    tail: null,
    size: 0,
    newToAdd: null,
    activeElement: null,
    sectionBeforeActiveElement: {},
    newElement: null,
    removeElement: null,
    container: [],
    indicatorToRemove: null,
    indicatorToAdd: null,
  };

  constructor({
                container, size, tail, head, activeElement, indicatorToRemove, indicatorToAdd,
                sectionBeforeActiveElement, newElement, removeElement, newToAdd
              }: ILinkListState<T>) {
    this.state = {
      container, size, tail, head, activeElement, indicatorToRemove, indicatorToAdd,
      sectionBeforeActiveElement, newElement, removeElement, newToAdd
    }
  }

  public getState(): ILinkListState<T> {
    return this.state;
  }
}

export class LinkListSnapshotStorage<T> implements ISnapshotStorage<ISnapshot<ILinkListState<T>>> {

  private snapshots: Array<ISnapshot<ILinkListState<T>> | null> = [];
  private originator: LinkList<T>;
  private head: number = 0;
  private length: number = 0;

  constructor(originator: LinkList<T>) {
    this.originator = originator;
  }

  isEmpty = () => this.length === 0;

  createAndStoreSnapshot(): void {
    const newSnapshot: ISnapshot<ILinkListState<T>> = this.originator.save()
    this.snapshots.push(newSnapshot);
    this.length++;
  }

  retrieveAndRemoveSnapshot = (): ISnapshot<ILinkListState<T>> | null => {
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