import {LinkedListNode} from "../../utils/linked-list-node";

export type TNewSnapList<T> = {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  size: number,
  newToAdd: LinkedListNode<T> | null;
  oldToRemove: LinkedListNode<T> | null;
  elementPointer: LinkedListNode<T> | null;
  sectionPointer: Record<string, true>;
  newElement: LinkedListNode<T> | null;
  removeElement: LinkedListNode<T> | null;
  containerList: Array<LinkedListNode<T> | null>,
}

export interface ILinkedList<T> {
  prepend: (element: T) => void;
  append: (element: T) => void;
  addByIndex: (element: T, position: number) => void;
  deleteByIndex: (position: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  getSize: () => number;
  getSnapshots: () => Array<TNewSnapList<T>>;
}

export class LinkedListWithSnapshots<T> implements ILinkedList<T> {
  private head: LinkedListNode<T> | null;
  private tail: LinkedListNode<T> | null;
  private size: number;
  private indicatorToAdd: LinkedListNode<T> | null;
  private indicatorToRemove: LinkedListNode<T> | null;
  private snapshots: Array<TNewSnapList<T>> = [];
  private elementPointer: LinkedListNode<T> | null;
  private sectionPointer: Record<string, true>;
  private removeElement: LinkedListNode<T> | null;
  private newElement: LinkedListNode<T> | null;

  constructor(initialElements?: Array<T>) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    this.elementPointer = null;         // выделение одного активного элемента
    this.sectionPointer = {};           // выделение секции до активного элемента

    this.indicatorToAdd = null;         // маленький кружок сверху
    this.newElement = null;             // новый элемент в массиве - зелёный

    this.indicatorToRemove = null;      // маленький кружок снизу
    this.removeElement = null;          // удаляемый элемент

    this.snapshots = []                  // снимки

    if (initialElements) {
      initialElements.forEach((value) => {
        const newNode = this.createNode(value);
        if (this.tail) {
          this.tail.next = newNode;
        } else {
          this.head = newNode;
        }
        this.tail = newNode;
        this.incrementSize();
      })
      this.saveHistory()
    }
  }

  private createNode(value: T): LinkedListNode<T> {
    return new LinkedListNode(value);
  }
  private getByIndex(index: number) {

    this.validateIndex(index)

    let current = this.head;

    for (let currentIndex = 0; current && currentIndex < index; ++currentIndex) {
      const id = current.id
      this.sectionPointer = {...this.sectionPointer, [id]: true}
      this.elementPointer = current
      this.saveHistory()
      current = current.next;
    }
    return current;
  }
  private clearHistory() {
    this.indicatorToAdd = null;
    this.indicatorToRemove = null;
    this.elementPointer = null;
    this.sectionPointer = {};
    this.newElement = null;
    this.removeElement = null;
    this.snapshots = []
  }
  private decrementSize(): void {
    this.size--;
  }
  private incrementSize(): void {
    this.size++;
  }
  private validateIndex(index: number) {
    if (index < 0 || index > this.size) {
      throw new Error('Неверная позиция');
    }
  }
  private saveHistory() {
    this.snapshots.push({
      head: this.head,
      tail: this.tail,
      size: this.size,
      newToAdd: this.indicatorToAdd,
      oldToRemove: this.indicatorToRemove,
      elementPointer: this.elementPointer,
      sectionPointer: this.sectionPointer,
      newElement: this.newElement,
      removeElement: this.removeElement,
      containerList: this.toArray()
    });
  }
  private toArray() {
    const result: Array<LinkedListNode<T>> = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }

  //публичные методы получения данных списка
  public getSize() {
    return this.size;
  }

  public getSnapshots() {
    return this.snapshots;
  }

  // публичные методы изменения списка
  public prepend(value: T) {
    this.snapshots = []
    this.clearHistory()
    this.indicatorToAdd = this.createNode(value);
    if (this.head) {
      this.elementPointer = this.head
      this.sectionPointer[this.head.id] = true
      this.saveHistory()


      this.indicatorToAdd.next = this.head
    }
    this.sectionPointer = {}
    this.elementPointer = null
    this.head = this.newElement = this.indicatorToAdd


    this.saveHistory()

    this.indicatorToAdd = null
    this.elementPointer = null
    /*    this.saveHistory()*/

    this.newElement = null
    this.saveHistory()


    this.incrementSize();
  }

  public append(element: T) {
    this.snapshots = []
    this.clearHistory()
    this.indicatorToAdd = this.createNode(element);

    if (this.tail) {
      this.sectionPointer[this.tail.id] = true
      this.elementPointer = this.tail
      this.saveHistory()

      this.tail.next = this.indicatorToAdd;
      this.sectionPointer = {}
      this.elementPointer = null
      this.newElement = this.tail = this.indicatorToAdd
      this.saveHistory()
    } else {
      this.head = this.indicatorToAdd;
    }

    this.newElement = this.indicatorToAdd = null
    this.incrementSize();
    this.saveHistory()
  }

  public addByIndex(element: T, index: number) {

    this.validateIndex(index)
    this.sectionPointer = {}

    if (index === 0) {
      this.prepend(element)
    } else {
      this.snapshots = []
      this.indicatorToAdd = this.createNode(element);
      const previous = this.getByIndex(index - 1)
      this.elementPointer = previous
      if (this.elementPointer) {
        const id = this.elementPointer.id
        this.sectionPointer = {...this.sectionPointer, [id]: true}
      }
      this.saveHistory()
      this.elementPointer = previous && previous.next
      this.saveHistory()
      if (previous) {
        previous.next = this.newElement = this.indicatorToAdd
      }
      this.indicatorToAdd.next = this.elementPointer
      this.indicatorToAdd = null
      this.elementPointer = null
      this.incrementSize();
      this.sectionPointer = {}
      this.saveHistory()
      this.newElement = null
      this.saveHistory()
    }
  }

  public deleteByIndex(index: number) {

    this.validateIndex(index)
    this.sectionPointer = {}
    this.snapshots = []
    const prev = this.getByIndex(index - 1)
    if (prev) {
      const id = prev.id
      this.sectionPointer = {...this.sectionPointer, [id]: true}
      this.saveHistory();
      this.indicatorToRemove = this.removeElement = prev.next
      this.saveHistory();
      prev.next = this.removeElement && this.removeElement.next
    }

    this.sectionPointer = {}
    this.decrementSize();
    this.saveHistory();
  }

  public deleteHead() {

    this.clearHistory()

    if (this.head === null) {
      throw new Error('deleteHead() - List is empty');
    } else {

      this.removeElement = this.head; // текущий элемент с пустым значением
      this.indicatorToRemove = this.head // маленький розовый

      this.saveHistory();

      this.head = this.head?.next || null;
      this.decrementSize();
      this.removeElement = null; // текущий элемент с пустым значением
      this.indicatorToRemove = null // маленький розовый

      this.saveHistory();
    }
  }

  public deleteTail() {
    this.clearHistory()
    if (this.size === 0) {
      throw new Error('deleteTail() - List is empty');
    }

    let penultimate = this.getByIndex(this.size - 2);
    this.clearHistory()

    this.removeElement = this.tail; // текущий элемент с пустым значением
    this.indicatorToRemove = this.tail // маленький розовый

    this.saveHistory();


    penultimate!.next = null;
    this.tail = penultimate;

    this.removeElement = null; // текущий элемент с пустым значением
    this.indicatorToRemove = null // маленький розовый

    this.saveHistory();
    this.decrementSize();
  }
}