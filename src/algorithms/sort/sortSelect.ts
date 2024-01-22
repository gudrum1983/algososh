import {ElementStates} from "../../types/element-states";
import {TColumn} from "../../pages/sorting-page/sorting-page";
import {cloneElements, setState, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";


export const sortSelect = (numbers: Array<TColumn>, direction: Direction): Array<Array<TColumn>> => {

  const initElements: Array<TColumn> = numbers

  const elements = cloneElements<TColumn>(initElements);
  const stateSnapshotsList: Array<Array<TColumn>> = [];

  let startIndex = 0
  let endIndex = elements.length - 1


  stateSnapshotsList.push(initElements)





  const {length} = elements;


  for (let startIndex = 0; startIndex < length - 1; startIndex++) {

    setState(ElementStates.Changing, elements[startIndex]);

    stateSnapshotsList.push(cloneElements<TColumn>(elements))

    let maxIndex = startIndex;

    for (let currentIndex = startIndex + 1; currentIndex < length; currentIndex++) {

      setState(ElementStates.Changing, elements[currentIndex]);
      stateSnapshotsList.push(cloneElements<TColumn>(elements))

      if (direction === Direction.Ascending ? elements[maxIndex].index < elements[currentIndex].index : elements[maxIndex].index > elements[currentIndex].index) {

/*      if (elements[maxIndex].index > elements[currentIndex].index) {*/
      } else {
        maxIndex = currentIndex
      }

      setState(ElementStates.Default, elements[currentIndex]);
    }

    setState(ElementStates.Default, elements[startIndex]);
    swap(elements, maxIndex, startIndex)
    setState(ElementStates.Modified, elements[startIndex]);
  }

  setState(ElementStates.Modified, elements[length - 1]);
  stateSnapshotsList.push(cloneElements<TColumn>(elements))

  return stateSnapshotsList

}