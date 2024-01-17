interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  getSize: () => number;
}

export class Stack<T> implements IStack<T> {
  private container: T[] = [];

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

  getSize = () => this.container.length;
}