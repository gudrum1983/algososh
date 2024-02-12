import {ISnapshot} from "../../../types/snapshots";
import {StackSnapshot} from "./stack-snapshot-storage";

export interface IStackState<T> {
  container: Array<T>;
  size: number;
  tailIndex: number | null;
  activeIndex: number | null;
}

export interface IStack<T> {
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
      this.container.push(item);
      this.size = this.getContainerLength();
      this.tailIndex = this.activeIndex = this.size - 1;
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
    this.backup = () => backup();
  }
}