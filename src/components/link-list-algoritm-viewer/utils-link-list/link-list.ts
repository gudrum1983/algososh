import {nanoid} from "nanoid";
import {ISnapshot} from "../../../types/snapshots";
import {LinkListSnapshot} from "./link-list-snapshot-storage";

export interface ILinkList<T> {
  prepend: (element: T) => void;
  append: (element: T) => void;
  addByIndex: (element: T, position: number) => void;
  deleteByIndex: (position: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  getSize: () => number;
  save: () => ISnapshot<ILinkListState<T>>;
}

export interface ILinkListState<T> {
  head: LinkListNode<T> | null;
  tail: LinkListNode<T> | null;
  size: number;
  activeElement: LinkListNode<T> | null;
  sectionBeforeActiveElement: Record<string, true>;
  newToAdd: LinkListNode<T> | null;
  indicatorToRemove: LinkListNode<T> | null;
  indicatorToAdd: LinkListNode<T> | null;
  newElement: LinkListNode<T> | null;
  removeElement: LinkListNode<T> | null;
  container: Array<LinkListNode<T> | null>;
}

export class LinkListNode<T> {
  letter: T;
  next: LinkListNode<T> | null;
  id: string;

  constructor(value: T, next?: LinkListNode<T> | null) {
    this.letter = value;
    this.next = (next === undefined ? null : next);
    this.id = nanoid(5);
  }
}

export class LinkList<T> implements ILinkList<T> {
  private head: LinkListNode<T> | null;
  private tail: LinkListNode<T> | null;
  private size: number;
  private activeElement: LinkListNode<T> | null;
  private sectionBeforeActiveElement: Record<string, true>;
  private indicatorToAdd: LinkListNode<T> | null;
  private indicatorToRemove: LinkListNode<T> | null;
  private removeElement: LinkListNode<T> | null;
  private newElement: LinkListNode<T> | null;
  private backup?: () => void;

  constructor(initialElements?: Array<T>) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.activeElement = null;              // выделение одного активного элемента
    this.sectionBeforeActiveElement = {};   // выделение секции до активного элемента
    this.indicatorToAdd = null;             // маленький кружок сверху
    this.indicatorToRemove = null;          // маленький кружок снизу
    this.removeElement = null;              // удаляемый элемент
    this.newElement = null;                 // новый элемент в массиве - зелёный

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
    }
  }

  private createNode(value: T): LinkListNode<T> {
    return new LinkListNode(value);
  }

  private setTail() {
    let current = this.head;
    while (current && current.next) {
      current = current.next;
    }
    this.tail = current;
  }


  private getByIndex(index: number, needBackup: boolean = true) {
    this.validateIndex(index);
    let current = this.head;
    for (let currentIndex = 0; current && currentIndex < index; ++currentIndex) {
      const id = current.id;
      if (needBackup && this.backup) {
        this.sectionBeforeActiveElement = {...this.sectionBeforeActiveElement, [id]: true};
        this.activeElement = current;
        this.backup();
      }
      current = current.next;
    }
    return current;
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

  setBackup(backup: () => void) {
    this.backup = () => backup();
  }

  public save(): ISnapshot<ILinkListState<T>> {
    return new LinkListSnapshot<T>({
      container: this.toArray(),
      head: this.head,
      tail: this.tail,
      size: this.size,
      activeElement: this.activeElement,
      sectionBeforeActiveElement: this.sectionBeforeActiveElement,
      indicatorToRemove: this.indicatorToRemove,
      indicatorToAdd: this.indicatorToAdd,
      newToAdd: this.newElement,
      removeElement: this.removeElement,
      newElement: this.newElement,
    });
  }

  private toArray() {
    const result: Array<LinkListNode<T>> = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }

  getSize() {
    return this.size;
  }

  prepend(value: T) {
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    this.indicatorToAdd = this.createNode(value);
    if (this.head) {
      this.activeElement = this.head;
      this.backup();
      this.indicatorToAdd.next = this.head;
    }
    this.activeElement = null;
    this.head = this.newElement = this.indicatorToAdd;
    this.backup();
    this.indicatorToAdd = null;
    this.activeElement = null;
    this.newElement = null;
    this.backup();
    this.incrementSize();
  }

  append(element: T) {
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    this.indicatorToAdd = this.createNode(element);
    if (this.tail) {
      this.activeElement = this.tail;
      this.backup();
      this.tail.next = this.indicatorToAdd;
      this.activeElement = null;
      this.newElement = this.tail = this.indicatorToAdd;
      this.backup();
    } else {
      this.head = this.indicatorToAdd;
    }
    this.newElement = this.indicatorToAdd = null;
    this.incrementSize();
    this.backup();
  }

  addByIndex(element: T, index: number) {
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    this.validateIndex(index);
    this.sectionBeforeActiveElement = {};
    if (index === 0) {
      this.prepend(element);
    } else {
      this.indicatorToAdd = this.createNode(element);
      const previous = this.getByIndex(index - 1);
      this.activeElement = previous;
      if (this.activeElement) {
        const id = this.activeElement.id;
        this.sectionBeforeActiveElement = {...this.sectionBeforeActiveElement, [id]: true};
      }
      this.backup();
      this.activeElement = previous && previous.next;
      this.backup();
      if (previous) {
        previous.next = this.newElement = this.indicatorToAdd;
      }
      this.indicatorToAdd.next = this.activeElement;
      this.indicatorToAdd = null;
      this.activeElement = null;
      this.setTail();
      this.incrementSize();
      this.sectionBeforeActiveElement = {};
      this.backup();
      this.newElement = null;
      this.backup();
    }
  }

  deleteByIndex(index: number) {
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    this.validateIndex(index);
    this.sectionBeforeActiveElement = {};
    const prev = this.getByIndex(index - 1);
    if (prev) {
      const id = prev.id;
      this.sectionBeforeActiveElement = {...this.sectionBeforeActiveElement, [id]: true};
      this.backup();
      this.indicatorToRemove = this.removeElement = prev.next;
      this.backup();
      prev.next = this.removeElement && this.removeElement.next;
    }
    this.sectionBeforeActiveElement = {};
    this.decrementSize();
    this.setTail();
    this.backup();
  }

  deleteHead() {
    if (this.head === null) {
      throw new Error('deleteHead() - List is empty');
    }
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    this.removeElement = this.head;
    this.indicatorToRemove = this.head;
    this.backup();
    this.head = this.head?.next || null;
    this.decrementSize();
    this.removeElement = null;
    this.indicatorToRemove = null;
    this.backup();
  }

  deleteTail() {
    if (this.size === 0) {
      throw new Error('deleteTail() - List is empty');
    }
    if (!this.backup) {
      throw new Error("Linked list hasn't backup");
    }
    let penultimate = this.getByIndex(this.size - 2, false);
    this.sectionBeforeActiveElement = {};
    this.removeElement = this.tail;
    this.indicatorToRemove = this.tail;
    this.backup();
    penultimate!.next = null;
    this.tail = penultimate;
    this.removeElement = null;
    this.indicatorToRemove = null;
    this.backup();
    this.decrementSize();
  }
}