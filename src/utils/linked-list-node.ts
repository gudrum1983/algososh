import {nanoid} from "nanoid";

export class LinkedListNode<T> {
  letter: T
  next: LinkedListNode<T> | null;
  id: string

  constructor(value: T, next?: LinkedListNode<T> | null) {
    this.letter = value;
    this.next = (next === undefined ? null : next);
    this.id = nanoid(5)
  }
}