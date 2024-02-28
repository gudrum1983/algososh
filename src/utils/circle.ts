import {ElementStates} from "../types/element-states";
import {nanoid} from "nanoid";

export interface ICircleElement {
  setDefaultState: () => void;
  setChangingState: () => void;
  setModifiedState: () => void;
  setLetter: (value: string | number) => void;
  clearLetter: () => void;
  setHead: (head: string | React.ReactElement) => void;
  clearHead: () => void;
  setTail: (tail: string | React.ReactElement) => void;
  clearTail: () => void;
  getIndex: () => number;
  setIndex: (index: number) => void;
  setSmallSize: (isSmall: boolean) => void;
  getElement:() => IStateCircleElement;
}

export interface IStateCircleElement {
  state: ElementStates;
  letter?: string;
  head?: string | React.ReactElement | null;
  index: number;
  tail?: string | React.ReactElement | null;
  isSmall?: boolean;
  id: string;
}

export class CircleElement implements ICircleElement {
  private state: ElementStates;
  private letter?: string;
  private head?: string | React.ReactElement | null;
  private index: number;
  private tail?: string | React.ReactElement | null;
  private isSmall?: boolean;
  private readonly id: string;

  constructor(value: string | number, index: number, id?: string) {
    this.state = ElementStates.Default;
    this.letter = String(value);
    this.head = null;
    this.index = index;
    this.tail = null;
    this.isSmall = false;
    this.id = id ? id :nanoid(5)
  }

  setDefaultState() {
    this.state = ElementStates.Default
  };

  setChangingState() {
    this.state = ElementStates.Changing
  };

  setModifiedState() {
    this.state = ElementStates.Modified
  };

  setLetter(value: string | number) {
    this.letter = String(value)
  };

  clearLetter() {
    this.letter = ""
  };

  setHead(head: string | React.ReactElement) {
    this.head = head
  };

  clearHead() {
    this.head = null
  };

  setTail(tail: string | React.ReactElement) {
    this.tail = tail
  };

  clearTail() {
    this.tail = null
  };

  getIndex() {
    return this.index
  };

  setIndex(index: number) {
    this.index = index
  };

  setSmallSize(isSmall: boolean) {
    this.isSmall = isSmall
  };

  getElement(): IStateCircleElement {
    return {
      state: this.state,
      letter: this.letter,
      head: this.head,
      index: this.index,
      tail: this.tail,
      isSmall: this.isSmall,
      id: this.id,
    }
  }
}