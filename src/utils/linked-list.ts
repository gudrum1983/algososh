import {LinkedListNode} from "./linked-list-node";

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
  container: Array<LinkedListNode<T> | null>,
}

export interface ILinkedList<T extends { id: string }> {
  append: (element: T) => void;
  prepend: (element: T) => void;
  addByIndex: (element: T, position: number) => void;
  deleteByIndex: (position: number) => void;
  getByIndex: (position: number) => LinkedListNode<T> | null;
  getSize: () => number;
  deleteHead: () => void;
  deleteTail: () => void;
  getSnap: () => Array<TNewSnapList<T>>;
}

export class LinkedList<T extends { id: string }> implements ILinkedList<T> {
  private head: LinkedListNode<T> | null;
  private tail: LinkedListNode<T> | null;
  private size: number;
  private newToAdd: LinkedListNode<T> | null;
  private oldToRemove: LinkedListNode<T> | null;
  private snapshots: Array<TNewSnapList<T>> = [];
  private elementPointer: LinkedListNode<T> | null;
  private sectionPointer: Record<string, true>;
  private removeElement: LinkedListNode<T> | null;
  private newElement: LinkedListNode<T> | null;

  constructor(initialElements?: Array<LinkedListNode<T>>) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    this.elementPointer = null;   // выделение одного активного элемента
    this.sectionPointer = {};  // выделение секции до активного элемента

    this.newToAdd = null;         // маленький кружок сверху
    this.newElement = null;

    this.oldToRemove = null;      // маленький кружок снизу
    this.removeElement = null;

    this.snapshots = []

    //пересоздаем список из значений initialElements, так как нет гарантии, что связи в элементах корректные
    //+ исходные данные останутся без изменений
    if (initialElements) {
      initialElements.forEach((element) => {
        this.InitAppend(element.value)

      })
      this.saveHistory()
    }
  }
  private createNode(element: T): LinkedListNode<T> {
    return new LinkedListNode(element);
  }
  private clearAll2() {
    this.newToAdd = null;
    this.oldToRemove = null;
    this.elementPointer = null;
    this.sectionPointer = {};
    this.newElement = null;
    this.removeElement = null;
    this.snapshots = []
  }
  private InitAppend(element: T) {
    const linkedListNode = this.createNode(element);
    if (this.tail) {
      this.tail.next = linkedListNode;
    } else {
      this.head = linkedListNode;
    }

    this.tail = linkedListNode;
    this.incrementSize();
  }
  private decrementSize(): void {
    this.size--;
  }
  private incrementSize(): void {
    this.size++;
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
      newToAdd: this.newToAdd,
      oldToRemove: this.oldToRemove,
      elementPointer: this.elementPointer,
      sectionPointer: this.sectionPointer,
      newElement: this.newElement,
      removeElement: this.removeElement,
      container: this.toArray()
    });
  }
  public addByIndex(element: T, index: number) {

    this.sectionPointer = {}

    this.validateIndex(index)

    if (index === 0) {
      this.prepend(element)
    } else {

      this.snapshots = []
      this.newToAdd = this.createNode(element);
      const previous = this.getByIndex(index - 1)
      this.elementPointer = previous
      if (this.elementPointer) {
        const id = this.elementPointer.value.id
        this.sectionPointer = {...this.sectionPointer, [id]: true}
      }
      this.saveHistory()
      this.elementPointer = previous && previous.next
      this.saveHistory()
      if (previous) {
        previous.next = this.newElement = this.newToAdd
      }
      this.newToAdd.next = this.elementPointer
      this.newToAdd = null
      this.elementPointer = null
      this.incrementSize();
      this.sectionPointer = {}
      this.saveHistory()
      this.newElement = null
      this.saveHistory()
    }
  }
  public deleteByIndex(index: number) {
    this.sectionPointer = {}
    this.snapshots = []
      const prev = this.getByIndex(index - 1)
    if (prev){
      const id = prev.value.id
      this.sectionPointer = {...this.sectionPointer, [id]: true}
      this.saveHistory();
      this.oldToRemove = this.removeElement = prev.next
      this.saveHistory();
      prev.next = this.removeElement && this.removeElement.next

    }

    this.sectionPointer = {}

      this.decrementSize();
      this.saveHistory();

  }
  public deleteHead() {

    this.clearAll2()

    if (this.head === null) {
      throw new Error('deleteHead() - List is empty');
    } else {

      this.removeElement = this.head; // текущий элемент с пустым значением
      this.oldToRemove = this.head // маленький розовый

      this.saveHistory();

      this.head = this.head?.next || null;
      this.decrementSize();
      this.removeElement = null; // текущий элемент с пустым значением
      this.oldToRemove = null // маленький розовый

      this.saveHistory();
    }
  }
  public deleteTail() {
    this.clearAll2()
    if (this.size === 0) {
      throw new Error('deleteTail() - List is empty');
    }

    let penultimate = this.getByIndex(this.size - 2);
    this.clearAll2()

    this.removeElement = this.tail; // текущий элемент с пустым значением
    this.oldToRemove = this.tail // маленький розовый

    this.saveHistory();


    penultimate!.next = null;
    this.tail = penultimate;

    /* if (this.head === this.tail) {
       //короткая запись - this.tail = null; this.head = this.tail;
       this.head = this.tail = null;
     } else {
       //находим предпоследний "penultimate" элемент
       let penultimate = this.getByIndex(this.size - 2);
       this.snapshots = []



       penultimate!.next = null;
       this.tail = penultimate;
     }*/

    this.removeElement = null; // текущий элемент с пустым значением
    this.oldToRemove = null // маленький розовый

    this.saveHistory();
    this.decrementSize();
  }
  public getByIndex(index: number) {

    this.validateIndex(index)

    let current = this.head;

    for (let currentIndex = 0; current && currentIndex < index; ++currentIndex) {
      const id = current.value.id
      this.sectionPointer = {...this.sectionPointer, [id]: true}
      this.elementPointer = current
      this.saveHistory()
      current = current.next;
    }
    return current;
  }
  public append(element: T) {
    this.snapshots = []
    this.clearAll2()
    this.newToAdd = this.createNode(element);


    if (this.tail) {
      this.sectionPointer[this.tail.value.id] = true
      this.elementPointer = this.tail
      this.saveHistory()

      this.tail.next = this.newToAdd;
      this.sectionPointer = {}
      this.elementPointer = null
      this.newElement = this.tail = this.newToAdd
      this.saveHistory()
    } else {
      this.head = this.newToAdd;
    }

    this.newElement = this.newToAdd = null
    this.incrementSize();
    this.saveHistory()
  }
  public prepend(element: T) {
    this.snapshots = []
    this.clearAll2()
    this.newToAdd = this.createNode(element);
    if (this.head) {
      this.elementPointer = this.head
      this.sectionPointer[this.head.value.id] = true
      this.saveHistory()


      this.newToAdd.next = this.head
    }
    this.sectionPointer = {}
    this.elementPointer = null
    this.head = this.newElement = this.newToAdd


    this.saveHistory()

    this.newToAdd = null
    this.elementPointer = null
    this.saveHistory()

    this.newElement = null
    this.saveHistory()


    this.incrementSize();
  }
  public getSize() {
    return this.size;
  }
  public getSnap() {
    return this.snapshots;
  }

}