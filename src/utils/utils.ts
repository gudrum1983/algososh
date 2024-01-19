import {Elements, Element} from "../pages/string/string";
import {ElementStates} from "../types/element-states";

export function cloneElements(elements: Elements): Elements {
  return elements.map(el => ({...el}));
}

export function allEqual<T>(...parameters: Array<T>) {
  return parameters.every(param => param === parameters[0]);
}

export function setChanging(a: Element, b: Element): void {
  a.state = ElementStates.Changing;
  if (!allEqual(a, b)) {
    b.state = ElementStates.Changing;
  }
}

function swapValue(a: Element, b: Element): void {
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
}

export function setModified(a: Element, b?: Element): void {
  a.state = ElementStates.Modified;
  if (b && !allEqual(a, b)) {
    b.state = ElementStates.Modified;
    if (!allEqual(a.value, b.value)) {
      swapValue(a, b)
    }
  }
}