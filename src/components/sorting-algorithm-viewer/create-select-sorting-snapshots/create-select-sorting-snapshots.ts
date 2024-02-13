import {cloneSnapElementsColumn, createDefaultColumnElements, swap} from "../../../utils/utils";
import {Direction} from "../../../types/direction";
import {IColumnComponent} from "../../../utils/column";

export const createSelectSortingSnapshots = (initElements: Array<IColumnComponent>, direction: Direction): Array<Array<IColumnComponent>> => {

  const elements = createDefaultColumnElements(initElements);
  const stateSnapshotsList: Array<Array<IColumnComponent>> = [];

  stateSnapshotsList.push(initElements)

  const {length} = elements;

  for (let startIndex = 0; startIndex < length - 1; startIndex++) {

    const start = elements[startIndex];
    let compareIndex = startIndex;
    start.setChangingState();
    stateSnapshotsList.push(cloneSnapElementsColumn(elements))

    for (let currentIndex = startIndex + 1; currentIndex < length; currentIndex++) {

      const curr = elements[currentIndex];
      const compare = elements[compareIndex];
      curr.setChangingState();
      stateSnapshotsList.push(cloneSnapElementsColumn(elements))

      //так как в массиве есть повторения, то сравнение с равно "<=" и ">="
      if (direction === Direction.Ascending ? compare.getIndex() >= curr.getIndex() : compare.getIndex() <= curr.getIndex()) {
        compareIndex = currentIndex;
      }
      curr.setDefaultState();
    }

    elements[startIndex].setDefaultState()
    swap(elements, compareIndex, startIndex);
    elements[startIndex].setModifiedState()
  }

  elements[length - 1].setModifiedState()
  stateSnapshotsList.push(cloneSnapElementsColumn(elements))

  return stateSnapshotsList
}