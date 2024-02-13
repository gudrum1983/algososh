import {ElementStates} from "../types/element-states";
import {ICircleComponent, ICircleElement} from "./circle";
import {ColumnElement, IColumnComponent, IColumnElement} from "./column";
import {nanoid} from "nanoid";

export function cloneElements<T>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el}));
}

export function  cloneSnapElements(elements: Array<ICircleElement>): Array<ICircleComponent> {
  return elements.map(el => el.getElement());
}

/*export function createDefaultCircleElements(elements: Array<ICircleComponent>): Array<ICircleElement> {
  return elements.map((item) => new CircleElement(item.letter, item.index, item.id));
}*/

export function createDefaultColumnElements(elements: Array<IColumnComponent>): Array<IColumnElement> {
  return elements.map((item) => new ColumnElement(item.index, item.id));
}

export function createDefaultColumnElements2(elements: Array<number>): Array<IColumnComponent> {
  return elements.map((item) => ({
    index: item,
    state: ElementStates.Default,
    id: nanoid(5)
  }))
}

export function cloneSnapElementsColumn(elements: Array<IColumnElement>): Array<IColumnComponent> {
  return elements.map(el => el.getElement());
}

type ElementWithGetElement<T> = T & {getElement: () => T};

export function cloneSnapElements2<T extends ICircleComponent | IColumnComponent>(
  elements: Array<ElementWithGetElement<T>>
): Array<T> {
  return elements.map(el => el.getElement());
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