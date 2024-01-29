import {ElementStates} from "../types/element-states";

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