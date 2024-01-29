import {ElementStates} from "../types/element-states";
import {nanoid} from "nanoid";
import {CircleBaseElement} from "../types/element-and-snapshot";
import {TElementStack} from "../components/container-stack/container-stack";


export function cloneElements<T>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el}));
}

//точно utils
export function swap<T>(arr: T[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function setState<T extends { state: ElementStates }>(state: ElementStates, a: T, b?: T): void {
  a.state = state;
  b && a !== b && (b.state = state);
}

/*export function createInitElements(numbers: Array<number>): Array<TElementColumn> {
  return numbers.map((item): TElementColumn => ({
    index: item,
    state: ElementStates.Default,
    id: nanoid(5)
  }))
}*/

export function copyAndResetElementStates<T extends { state: ElementStates }>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el, state: ElementStates.Default}));
}


export function createStackItem(value: string, state: ElementStates, index: number): TElementStack {
  return {
    letter: value,
    index: index,
    id: nanoid(5),
    state: state,
    top: true,
  }
}

export type TElementQueue1 = TElementQueue2 & Pick<CircleBaseElement, "id">
export type TElementQueue2 = Pick<CircleBaseElement,
  "letter"
  | "state"
>

export function createQueueItem({letter, state}: TElementQueue2): TElementQueue1 {
  return {
    letter: letter,
    state: state,
    id: nanoid(5),
  }
}

export type TElementList = Pick<CircleBaseElement,
  "letter"
  | "id"
>


/*export function createListItem(letter: string): TElementList {
  return {
    letter: letter,
    id: nanoid(5),
  }
}*/

export enum Buttons {
  addHead = "addHead",
  addTail = "addTail",
  deleteHead = "deleteHead",
  deleteTail = "deleteTail",
  addByIndex = "addByIndex",
  deleteByIndex = "deleteByIndex",
  clear = "clear",
  reverse = "reverse",
  fibonacci = "fibonacci",
  sortDescending = "sortDescending",
  sortAscending = "sortAscending"
}

export enum Path {
  string = "/string",
  fibonacci = "/fibonacci",
  sorting = "/sorting",
  stack = "/stack",
  queue = "/queue",
  list = "/list",
}
