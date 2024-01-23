import {ElementStates} from "../../types/element-states";
import {TElementColumn} from "../../pages/sorting-page/sorting-page";
import {cloneElements, setState, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";
import {TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";

export const createSelectSortingSnapshots = (initElements: TSnapshot<TElementColumn>, direction: Direction): TSnapshotsList<TElementColumn> => {

  const elements = cloneElements(initElements);
  const stateSnapshotsList: TSnapshotsList<TElementColumn> = [];

  stateSnapshotsList.push(initElements);

  const {length} = elements;

  for (let startIndex = 0; startIndex < length - 1; startIndex++) {

    const start = elements[startIndex];
    let compareIndex = startIndex;

    setState(ElementStates.Changing, start);
    stateSnapshotsList.push(cloneElements(elements));

    for (let currentIndex = startIndex + 1; currentIndex < length; currentIndex++) {

      const curr = elements[currentIndex];
      const compare = elements[compareIndex];

      setState(ElementStates.Changing, curr);
      stateSnapshotsList.push(cloneElements(elements));

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
  stateSnapshotsList.push(cloneElements(elements))

  return stateSnapshotsList
}