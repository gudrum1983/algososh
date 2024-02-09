import {ElementStates} from "../../types/element-states";
import {cloneElements, setState, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";
import {TElementSorting, TSnapshotSorting} from "../../components/container-sorting/container-sorting";

export const createSelectSortingSnapshots = (initElements: Array<TElementSorting>, direction: Direction): Array<TSnapshotSorting> => {

  const elements = cloneElements(initElements);
  const stateSnapshotsList: Array<TSnapshotSorting> = [];

  stateSnapshotsList.push({containerSorting:initElements})

  const {length} = elements;

  for (let startIndex = 0; startIndex < length - 1; startIndex++) {

    const start = elements[startIndex];
    let compareIndex = startIndex;

    setState(ElementStates.Changing, start);
    stateSnapshotsList.push({containerSorting:cloneElements(elements)})

    for (let currentIndex = startIndex + 1; currentIndex < length; currentIndex++) {

      const curr = elements[currentIndex];
      const compare = elements[compareIndex];

      setState(ElementStates.Changing, curr);
      stateSnapshotsList.push({containerSorting:cloneElements(elements)})

      //так как в массиве есть повторения, то сравнение с равно "<=" и ">="
      if (direction === Direction.Ascending ? compare.index >= curr.index : compare.index <= curr.index) {
        compareIndex = currentIndex;
      }
      setState(ElementStates.Default, curr);
    }

    setState(ElementStates.Default, elements[startIndex]);
    swap(elements, compareIndex, startIndex);
    setState(ElementStates.Modified, elements[startIndex]);
  }

  setState(ElementStates.Modified, elements[length - 1]);
  stateSnapshotsList.push({containerSorting:cloneElements(elements)})

  return stateSnapshotsList
}