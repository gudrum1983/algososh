import {ElementStates} from "../types/element-states";
import {TItem} from "../components/string/string";
import {IQueue} from "./queue";

export type TCheck = Array<TItem>

export function reverseWithHistory(letters: TCheck, steps: IQueue<TCheck>): any {

  let stepTemp = letters.slice();
  let history = steps
  let startIndex = 0
  let endIndex = stepTemp.length - 1


  while (startIndex <= endIndex) {
    let start = stepTemp[startIndex]
    let end = stepTemp[endIndex]
    history.enqueue(setChanging(start, end))
    history.enqueue(setModified(start, end))
    endIndex--
    startIndex++
  }

  return history
}


function setChanging(a: any, b: any):TCheck {
  if (a === b) {
    return [{state: ElementStates.Changing, number: a.number, value: a.value,}];
  } else {
    return [{state: ElementStates.Changing, number: a.number, value: a.value}, {
      state: ElementStates.Changing,
      number: b.number,
      value: b.value
    }]
  }
}

function setModified(a: any, b: any):TCheck {
  if (a === b) {
    return [{
      state: ElementStates.Modified,
      value: b.value,
      number: b.number

    }];
  } else {
    return [{
      state: ElementStates.Modified,
      value: b.value,
      number: a.number

    }, {

        state: ElementStates.Modified,
        value: a.value,
        number: b.number

    }]
  }
}


function swap(a: TItem, b: TItem) {
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
}