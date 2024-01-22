import {ElementStates} from "../../types/element-states";
import {nanoid} from "nanoid";
import {TColumn} from "../../pages/sorting-page/sorting-page";
import {cloneElements, setState, swap} from "../../utils/utils";
import {Direction} from "../../types/direction";


export const sortBubble = (numbers: Array<TColumn>, direction:Direction): Array<Array<TColumn>> => {

  const initElements: Array<TColumn> = numbers

  const elements = cloneElements<TColumn>(initElements);
  const stateSnapshotsList: Array<Array<TColumn>> = [];

  let startIndex = 0
  let endIndex = elements.length - 1


  stateSnapshotsList.push(initElements)


  const end = elements[endIndex]
  let currIndex = 0


  for (let i = 0; i < elements.length; i++) {
    let swapped = false;


    for (let j = 0; j < elements.length - i - 1; j++) {

      setState(ElementStates.Changing, elements[j], elements[j + 1]);
      stateSnapshotsList.push(cloneElements<TColumn>(elements))

      if (direction === Direction.Ascending ? elements[j].index > elements[j + 1].index : elements[j].index < elements[j + 1].index) {
        swap(elements, j, j + 1);
        stateSnapshotsList.push(cloneElements<TColumn>(elements))
        swapped = true;
      }
      setState(ElementStates.Default, elements[j], elements[j + 1]);
    }
    if (!swapped) {
      let index = elements.length - i - 1
      console.log({i})
      console.log({index})
      while (index >= 0) {
        console.log(index)
        const test = elements[index]
        console.log({test})
        setState(ElementStates.Modified, test);
        index--
      }

      stateSnapshotsList.push(cloneElements<TColumn>(elements))
      return stateSnapshotsList;
    }


    setState(ElementStates.Modified, elements[elements.length - i - 1]);
    stateSnapshotsList.push(cloneElements<TColumn>(elements))
  }

  return stateSnapshotsList


}