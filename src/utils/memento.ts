import {ICircleComponent} from "./circle";
import {IColumnComponent} from "./column";

/**
 * Создатель содержит некоторое важное состояние, которое может со временем
 * меняться. Он также объявляет метод сохранения состояния внутри снимка и метод
 * восстановления состояния из него.
 */
export class Originator<T> {
  /** Для удобства состояние создателя хранится внутри одной переменной. */
  private state: T;

  constructor(state: T) {
    this.state = state;
  }

  getState(): T {
    return this.state;
  };

  setState(state: T): void {
    this.state = state;
  }

  /** Сохраняет текущее состояние внутри снимка. */
  save(): Memento<T> {
    return new ConcreteMemento<T>(this.state);
  }

  /** Восстанавливает состояние Создателя из объекта снимка. */
  public restore(memento: Memento<T>): void {
    this.state = memento.getState();
  }
}

/**
 * Интерфейс Снимка предоставляет способ извлечения метаданных снимка, таких как
 * дата создания или название (которые я не стала пока реализовывать). Однако он не раскрывает состояние Создателя.
 */
interface Memento<T> {
  getState(): T;
}

/** Конкретный снимок содержит инфраструктуру для хранения состояния Создателя. */
class ConcreteMemento<T> implements Memento<T> {
  private state: T;

  constructor(state: T) {
    this.state = state;
  }

  /** Создатель использует этот метод, когда восстанавливает своё состояние. */
  public getState(): T {
    return this.state;
  }
}


/**
 * Опекун не зависит от класса Конкретного Снимка. Таким образом, он не имеет
 * доступа к состоянию создателя, хранящемуся внутри снимка. Он работает со
 * всеми снимками через базовый интерфейс Снимка.
 */
export class Caretaker<T> {

  private mementos: Array<Memento<T> | null> = [];
  private originator: Originator<T>;
  private head: number = 0;
  private length: number = 0;

  constructor(originator: Originator<T>) {
    this.originator = originator;
  }

  isEmpty = () => this.length === 0;

  createAndStoreSnapshot(): void {
    this.mementos.push(this.originator.save());
    this.length++;
  }

  retrieveAndRemoveSnapshot = (): void => {
    if (this.isEmpty()) {
      throw new Error("No elements in the Snapshots");
    } else {
      const currentSnapshot = this.mementos[this.head];
      this.mementos[this.head] = null;
      this.head++;
      this.length--;
      currentSnapshot && this.originator.restore(currentSnapshot);
    }
  };

  clear = () => {
    this.mementos = [];
    this.head = 0;
    this.length = 0;
  };
}

export type TStateAndSnapshotStorage<T extends ICircleComponent & IColumnComponent> = {
  state: Originator<Array<T>>;
  snapshotStorage: Caretaker<Array<T>>
}