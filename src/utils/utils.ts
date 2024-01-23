import {ElementStates} from "../types/element-states";
import {nanoid} from "nanoid";
import {TSnapshot, TSnapshotsList} from "../types/element-and-snapshot";
import {TElementFibonacci} from "../pages/fibonacci-page/fibonacci-page";
import {TElementColumn} from "../pages/sorting-page/sorting-page";
import {TElementString} from "../pages/string-page/string-page";


export function cloneElements<T>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el}));
}

export function allEqual<T>(...parameters: Array<T>) {
  return parameters.every(param => param === parameters[0]);
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


export function createElementFibonacci(letter: string, index:number): TElementFibonacci {
  return {
    letter: letter,
    index: index,
    id: nanoid(5)
  }
}