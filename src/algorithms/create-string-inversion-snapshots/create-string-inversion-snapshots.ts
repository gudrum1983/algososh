import {ElementStates} from "../../types/element-states";
import {cloneElements, createInitElementsString, setState, swap} from "../../utils/utils";

import {TElementString} from "../../pages/string-page/string-page";

export const createStringInversionSnapshots = (string: string): Array<Array<TElementString>> => {

  const initElements = createInitElementsString(string)

  const elements = cloneElements(initElements);
  const snapshotsList: Array<Array<TElementString>> = [];

  let startIndex = 0
  let endIndex = elements.length - 1

  while (startIndex <= endIndex) {

    const start = elements[startIndex]
    const end = elements[endIndex]
    const nextStartIndex = startIndex + 1
    const prevEndIndex = endIndex - 1

    if (startIndex === endIndex) {
      setState(ElementStates.Modified, start)
      snapshotsList.push(cloneElements(elements))
      return snapshotsList
    }

    if (startIndex === 0) {
      snapshotsList.push(cloneElements<TElementString>(elements))
      setState(ElementStates.Changing, start, end)
      snapshotsList.push(cloneElements(elements))
    }

    swap(elements, startIndex, endIndex)
    setState(ElementStates.Modified, start, end)

    if (nextStartIndex >= endIndex) {
      snapshotsList.push(cloneElements(elements))
      return snapshotsList
    }

    const nextStart = elements[nextStartIndex]
    const prevEnd = elements[prevEndIndex]
    setState(ElementStates.Changing, nextStart, prevEnd)
    snapshotsList.push(cloneElements(elements))
    endIndex--
    startIndex++
  }
  return snapshotsList
}