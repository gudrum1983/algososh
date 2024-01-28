import {ElementStates} from "../types/element-states";
import {nanoid} from "nanoid";
import {TElementFibonacci} from "../pages/fibonacci-page/fibonacci-page";
import {TElementColumn} from "../pages/sorting-page/sorting-page";
import {TElementString} from "../pages/string-page/string-page";
import {TElementStack} from "../pages/stack-page/stack-page";
import {CircleBaseElement} from "../types/element-and-snapshot";


export function cloneElements<T>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el}));
}

export function swap<T>(arr: T[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function setState<T extends { state: ElementStates }>(state: ElementStates, a: T, b?: T): void {
  a.state = state;
  b && a !== b && (b.state = state);
}

export function createInitElements(numbers: Array<number>): Array<TElementColumn> {
  return numbers.map((item): TElementColumn => ({
    index: item,
    state: ElementStates.Default,
    id: nanoid(5)
  }))
}

export function copyAndResetElementStates<T extends { state: ElementStates }>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el, state: ElementStates.Default}));
}

export function createInitElementsString(string: string): Array<TElementString> {
  return string.split('').map((item) => ({
    letter: item,
    state: ElementStates.Default,
    id: nanoid(5)
  }))
}


export function createElementFibonacci(letter: string, index: number): TElementFibonacci {
  return {
    letter: letter,
    index: index,
    id: nanoid(5)
  }
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
}