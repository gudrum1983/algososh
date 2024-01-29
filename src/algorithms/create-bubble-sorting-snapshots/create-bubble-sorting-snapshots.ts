import {ElementStates} from "../../types/element-states";
import {cloneElements, setState, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";
import {TElementSorting, TSnapshotSorting} from "../../components/container-sorting/container-sorting";


export const createBubbleSortingSnapshots = (initElements: Array<TElementSorting>, direction: Direction): Array<TSnapshotSorting> => {

  const elements = cloneElements(initElements);
  const stateSnapshotsList: Array<TSnapshotSorting> = [];

  stateSnapshotsList.push({containerSorting:initElements})

  const {length} = elements;

  for (let startIndex = 0; startIndex < length; startIndex++) {
    let swapped = false;

    for (let currentIndex = 0; currentIndex < length - startIndex - 1; currentIndex++) {

      const nextIndex = currentIndex + 1
      const current = elements[currentIndex]
      const next = elements[nextIndex]

      setState(ElementStates.Changing, current, next);
      stateSnapshotsList.push({containerSorting:cloneElements(elements)})

      if (direction === Direction.Ascending ? current.index > next.index : current.index < next.index) {
        swap(elements, currentIndex, nextIndex);
        stateSnapshotsList.push({containerSorting:cloneElements(elements)});
        swapped = true;
      }
      setState(ElementStates.Default, current, next);
    }

    if (!swapped) {
      let index = length - startIndex - 1;

      for (let i = index; i >= 0; i--) {
        setState(ElementStates.Modified, elements[i]);
      }

      stateSnapshotsList.push({containerSorting:cloneElements(elements)});
      return stateSnapshotsList;
    }

    setState(ElementStates.Modified, elements[length - startIndex - 1]);
    stateSnapshotsList.push({containerSorting:cloneElements(elements)});
  }

  return stateSnapshotsList;
}