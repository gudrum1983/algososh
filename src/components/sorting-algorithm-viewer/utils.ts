import {cloneSnapElementsColumn, createDefaultColumnElements, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";
import {IColumnComponent} from "../../utils/column";
import {IStateCircleElement} from "../../utils/circle";
import {
  Originator,
  Caretaker,
  TStateAndSnapshotStorage
} from "../../utils/memento";


export const createSelectionSortingSnapshots = (initElements: Array<IColumnComponent>, direction: Direction): TStateAndSnapshotStorage<IStateCircleElement> => {

  const elements = createDefaultColumnElements(initElements);

  const state = new Originator<Array<IColumnComponent>>(initElements);
  const snapshotStorage = new Caretaker<Array<IColumnComponent>>(state);
  snapshotStorage.createAndStoreSnapshot()

  const {length} = elements;

  for (let startIndex = 0; startIndex < length - 1; startIndex++) {

    const start = elements[startIndex];
    let compareIndex = startIndex;
    start.setChangingState();

    state.setState(cloneSnapElementsColumn(elements));
    snapshotStorage.createAndStoreSnapshot();

    for (let currentIndex = startIndex + 1; currentIndex < length; currentIndex++) {

      const curr = elements[currentIndex];
      const compare = elements[compareIndex];
      curr.setChangingState();

      state.setState(cloneSnapElementsColumn(elements));
      snapshotStorage.createAndStoreSnapshot();

      if (direction === Direction.Ascending ? compare.getIndex() > curr.getIndex() : compare.getIndex() < curr.getIndex()) {
        compareIndex = currentIndex;
      }
      curr.setDefaultState();
    }

    elements[startIndex].setDefaultState()
    swap(elements, compareIndex, startIndex);
    elements[startIndex].setModifiedState()
  }

  elements[length - 1].setModifiedState()

  state.setState(cloneSnapElementsColumn(elements));
  snapshotStorage.createAndStoreSnapshot();

  return {state, snapshotStorage}
}
export const createBubbleSortingSnapshots = (initElements: Array<IColumnComponent>, direction: Direction): TStateAndSnapshotStorage<IStateCircleElement> => {

  const elements = createDefaultColumnElements(initElements);

  const state = new Originator<Array<IColumnComponent>>(initElements);
  const snapshotStorage = new Caretaker<Array<IColumnComponent>>(state);
  snapshotStorage.createAndStoreSnapshot()

  const {length} = elements;

  for (let startIndex = 0; startIndex < length; startIndex++) {
    let swapped = false;

    for (let currentIndex = 0; currentIndex < length - startIndex - 1; currentIndex++) {

      const nextIndex = currentIndex + 1
      const current = elements[currentIndex]
      const next = elements[nextIndex]

      current.setChangingState();
      next.setChangingState();
      state.setState(cloneSnapElementsColumn(elements));
      snapshotStorage.createAndStoreSnapshot();

      if (direction === Direction.Ascending ? current.getIndex() > next.getIndex() : current.getIndex() < next.getIndex()) {
        swap(elements, currentIndex, nextIndex);
        state.setState(cloneSnapElementsColumn(elements));
        snapshotStorage.createAndStoreSnapshot();
        swapped = true;
      }
      current.setDefaultState();
      next.setDefaultState();
    }

    if (!swapped) {
      let index = length - startIndex - 1;

      for (let i = index; i >= 0; i--) {
        elements[i].setModifiedState()
      }
      state.setState(cloneSnapElementsColumn(elements));
      snapshotStorage.createAndStoreSnapshot();
      return {state, snapshotStorage}
    }
    elements[length - startIndex - 1].setModifiedState()
    state.setState(cloneSnapElementsColumn(elements));
    snapshotStorage.createAndStoreSnapshot();
  }
  return {state, snapshotStorage}
}