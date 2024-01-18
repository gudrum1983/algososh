import {ElementStates} from "../types/element-states";
import {TItem} from "../pages/string/string";
import {IQueue} from "./queue";

export type TCheck = Array<TItem>

export function reverseWithHistory(letters: TCheck): any {

  let stepTemp = letters.slice();
/*  let deepCopiedArray = JSON.parse(JSON.stringify(letters));*/
/*  let history = steps*/
  let history2:Array<TCheck> = []
  let startIndex = 0
  let endIndex = stepTemp.length - 1



/*  history.enqueue(setChanging(stepTemp[startIndex], stepTemp[endIndex]))*/
  history2.push(setChanging(stepTemp[startIndex], stepTemp[endIndex]))


  while (startIndex <= endIndex) {
    let start = stepTemp[startIndex]
    let end = stepTemp[endIndex]

    const nextEndIndex = endIndex - 1
    const nextStartIndex = startIndex + 1
    const modifiedItems = setModified(start, end)
    const changingItems = (nextStartIndex <= nextEndIndex) ? setChanging( stepTemp[nextStartIndex], stepTemp[nextEndIndex]) : []
 /*   history.enqueue([...modifiedItems, ...changingItems])*/
    history2.push([...modifiedItems, ...changingItems])

    endIndex = nextEndIndex
    startIndex = nextStartIndex
  }

  return history2
}


function setChanging(a: any, b: any): TCheck {
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

function setModified(a: any, b: any): TCheck {
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


/*
function swap(a: TItem, b: TItem) {
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
}*/
