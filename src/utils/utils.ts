import {TElement} from "../pages/string/string";
import {ElementStates} from "../types/element-states";

export function cloneElements(elements: Array<TElement>): Array<TElement> {
  return elements.map(el => ({...el}));
}

export function allEqual<T>(...parameters: Array<T>) {
  return parameters.every(param => param === parameters[0]);
}

export function setChanging(a: TElement, b: TElement): void {
  a.state = ElementStates.Changing;
  b && a !== b && (b.state = ElementStates.Changing);
}

function swapValue(a: TElement, b: TElement): void {
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
}

export function swap<T>(arr: T[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function setModified(a: TElement, b?: TElement): void {
  a.state = ElementStates.Modified;
  if (b && a !== b) {
    b.state = ElementStates.Modified;
    if (!allEqual(a.value, b.value)) {
      swapValue(a, b)
    }
  }
}

export function setState(state: ElementStates, a: TElement, b?: TElement): void {
  a.state = state;
  b && a !== b && (b.state = state);
}