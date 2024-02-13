import {ElementStates} from "../types/element-states";
import {nanoid} from "nanoid";

export interface IColumnElement {
  setDefaultState: () => void;
  setChangingState: () => void;
  setModifiedState: () => void;
  setIndex: (index: number) => void;
  getIndex: () => number;
  getElement:() => IColumnComponent;
}

export interface IColumnComponent {
  state: ElementStates;
  index: number;
  id: string;
}

export class ColumnElement implements IColumnElement {
  private state: ElementStates;
  private index: number;
  private readonly id: string;
  constructor(index: number, id?: string) {
    this.state = ElementStates.Default;
    this.index = index;
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

  setIndex(index: number) {
    this.index = index
  };

  getIndex() {
    return this.index
  };

  getElement(): IColumnComponent {
    return {
      state: this.state,
      index: this.index,
      id: this.id,
    }
  }
}