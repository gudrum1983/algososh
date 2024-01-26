import {LinkedListNode} from "./linked-list-node";
import {createListItemSmall, TElementList} from "./utils";

export type TNewSnapList<T> = {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  size: number,
  newToAdd: LinkedListNode<T> | null;
  oldToRemove: LinkedListNode<T> | null;
  elementPointer: LinkedListNode<T> | null;
  sectionPointer: LinkedListNode<T> | null;
  newElement: LinkedListNode<T> | null;
  removeElement: LinkedListNode<T> | null;
  container: Array<LinkedListNode<T> | null>,
}

export interface ILinkedList<T> {
  append: (element: T) => void;
  prepend: (element: T) => void;
  addByIndex: (element: T, position: number) => void;
  deleteByIndex: (position: number) => void;
  getByIndex: (position: number) => LinkedListNode<T> | null;
  getSize: () => number;
  deleteHead: () => void;
  deleteTail: () => void;
  toArray: () => Array<LinkedListNode<T>>;
  getSnap:() => Array<TNewSnapList<T>>;
}


export function createListSnaphotsPush(stack: ILinkedList<TElementList>, value: string) {


  //если очередь есть = надо заменить на другое???
  if (stack) {

    const newItem = createListItemSmall(value)

    stack.prepend(newItem)
    /*  stack.saveHistory()

      if (newItem && newItem.state) {
        const item = {...newItem, state: ElementStates.Default}
        stack.changeLast(item)
      }

      stack.saveHistory()
  */
  }
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: LinkedListNode<T> | null;
  private tail: LinkedListNode<T> | null;
  private size: number;
  private newToAdd: LinkedListNode<T> | null;
  private oldToRemove: LinkedListNode<T> | null;
  private snapshots: Array<TNewSnapList<T>> = [];
  private elementPointer: LinkedListNode<T> | null;
  private sectionPointer: LinkedListNode<T> | null;
  private removeElement: LinkedListNode<T> | null;
  private newElement: LinkedListNode<T> | null;


  constructor(initialElements?: Array<LinkedListNode<T>>) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    this.elementPointer = null;   // выделение одного активного элемента
    this.sectionPointer = null;  // выделение секции до активного элемента

    this.newToAdd = null;         // маленький кружок сверху
    this.newElement = null;

    this.oldToRemove = null;      // маленький кружок снизу
    this.removeElement = null;

    this.snapshots = []

    //пересоздаем список из значений initialElements, так как нет гарантии, что связи в элементах корректные
    //+ исходные данные останутся без изменений
    if (initialElements) {
      initialElements.forEach((element) => {
        this.append(element.value)

      })
      this.saveHistory()
    }
  }

  private createNode(element: T): LinkedListNode<T> {
    return new LinkedListNode(element);
  }

  addByIndex(element: T, index: number) {

    this.validateIndex(index)

    if (index === 0) {
      this.prepend(element)
    } else if (index === this.size - 1) {
      this.append(element)
    } else {
      const linkedListNode = this.createNode(element);
      const previous = this.getByIndex(index - 1)
      linkedListNode.next = previous?.next ?? null
      this.incrementSize();
    }

  }

  deleteByIndex(index: number) {

    this.validateIndex(index)

    if (index === 0) {
      this.deleteHead()
    } else if (index === this.size - 1) {
      this.deleteTail()
    } else {
      const previous = this.getByIndex(index - 1)
      if (previous) {
        previous.next = previous?.next?.next ?? null
      }
      this.decrementSize();

    }
  }

  ///ГОТОВО
  deleteHead() {
    if (this.head === null) {
      throw new Error('deleteHead() - List is empty');
    } else {
      this.head = this.head?.next || null;
      this.decrementSize();
    }
  }

  ///ГОТОВО
  deleteTail() {
    if (this.size === 0) {
      throw new Error('deleteTail() - List is empty');
    }

    if (this.head === this.tail) {
      //короткая запись - this.tail = null; this.head = this.tail;
      this.head = this.tail = null;
    } else {
      //находим предпоследний "penultimate" элемент
      let penultimate = this.getByIndex(this.size - 2);
      penultimate!.next = null;
      this.tail = penultimate;
    }

    this.decrementSize();
  }

  ///ГОТОВО
  getByIndex(index: number) {

    this.validateIndex(index)

    let current = this.head;

    for (let currentIndex = 0; current && currentIndex < index; ++currentIndex) {
      current = current.next;
    }

    return current;
  }

  ///ГОТОВО
  append(element: T) {
    const linkedListNode = this.createNode(element);
    if (this.tail) {
      this.tail.next = linkedListNode;
    } else {
      this.head = linkedListNode;
    }

    this.tail = linkedListNode;
    this.incrementSize();
  }

  /////ГОТОВО
  prepend(element: T) {
    this.snapshots=[]

    this.newToAdd = this.createNode(element);
    this.elementPointer = this.head
    this.saveHistory()

    if (this.head) {
      this.newToAdd.next = this.head

/*      nextHead.next = this.newToAdd*/
    }
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

  ///ГОТОВО
  getSize() {
    return this.size;
  }

  getSnap() {
    return this.snapshots;
  }

  private decrementSize(): void {
    this.size--;
  }

  private incrementSize(): void {
    this.size++;
  }

  ////ГОТОВО
  toArray() {
    const result: Array<LinkedListNode<T>> = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    console.log({result})
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


}