import {ElementStates} from "../types/element-states";
import {IStateCircleElement, ICircleElement} from "./circle";
import {ColumnElement, IColumnComponent, IColumnElement} from "./column";
import {nanoid} from "nanoid";

export function cloneElements<T>(elements: Array<T>): Array<T> {
  return elements.map(el => ({...el}));
}

export function  cloneSnapElements(elements: Array<ICircleElement>): Array<IStateCircleElement> {
  return elements.map(el => el.getElement());
}

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


export function swap<T>(arr: T[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function setState<T extends { state: ElementStates }>(state: ElementStates, a: T, b?: T): void {
  a.state = state;
  b && a !== b && (b.state = state);
}