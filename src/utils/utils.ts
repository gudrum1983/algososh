import {ElementStates} from "../types/element-states";
import {TColumn} from "../pages/sorting-page/sorting-page";
import {nanoid} from "nanoid";

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

export function setState<T extends {state:ElementStates}>(state: ElementStates, a: T, b?: T): void {
  a.state = state;
  b && a !== b && (b.state = state);
}

export function createInitElements(numbers: Array<number>):Array<TColumn> {
  return numbers.map((item): TColumn => ({
    index: item,
    state: ElementStates.Default,
    id: nanoid(5)
  }))
}

export function copyAndResetElementStates<T extends {state:ElementStates}>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el, state:ElementStates.Default}));
}