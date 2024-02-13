import {cloneSnapElementsColumn, createDefaultColumnElements, swap} from "../../../utils/utils";
import {Direction} from "../../../types/direction";

import {IColumnComponent} from "../../../utils/column";

export const createBubbleSortingSnapshots = (initElements: Array<IColumnComponent>, direction: Direction): Array<Array<IColumnComponent>> => {

  const elements = createDefaultColumnElements(initElements);
  const stateSnapshotsList: Array<Array<IColumnComponent>> = [];

  stateSnapshotsList.push(initElements)

  const {length} = elements;

  for (let startIndex = 0; startIndex < length; startIndex++) {
    let swapped = false;

    for (let currentIndex = 0; currentIndex < length - startIndex - 1; currentIndex++) {

      const nextIndex = currentIndex + 1
      const current = elements[currentIndex]
      const next = elements[nextIndex]

      current.setChangingState();
      next.setChangingState();
      stateSnapshotsList.push(cloneSnapElementsColumn(elements))

      if (direction === Direction.Ascending ? current.getIndex() > next.getIndex() : current.getIndex() < next.getIndex()) {
        swap(elements, currentIndex, nextIndex);
        stateSnapshotsList.push(cloneSnapElementsColumn(elements))
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

      stateSnapshotsList.push(cloneSnapElementsColumn(elements))
      return stateSnapshotsList;
    }
    elements[length - startIndex - 1].setModifiedState()

    stateSnapshotsList.push(cloneSnapElementsColumn(elements))
  }

  return stateSnapshotsList;
}