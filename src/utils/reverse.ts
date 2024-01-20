import {ElementStates} from "../types/element-states";
import {TElement} from "../pages/string/string";
import {cloneElements, setState, swap} from "./utils";
import {v4 as uuidv4} from 'uuid';

export const generateReversedStringSnapshots = (string: string): Array<Array<TElement>> => {

  //Массив элементов созданных из каждого символа строки
  const initElements: Array<TElement> = string.split('').map((item) => ({
    value: item,
    state: ElementStates.Default,
    id: uuidv4()
  }))

  //Копия массива initElements для сортировки
  const elements = cloneElements(initElements);
  const stateSnapshotsList: Array<Array<TElement>> = [];
  //Массив для хранения истории разворота


  let startIndex = 0
  let endIndex = elements.length - 1

  while (startIndex <= endIndex) {

    const start = elements[startIndex]
    const end = elements[endIndex]
    const nextStartIndex = startIndex + 1
    const prevEndIndex = endIndex - 1


    if (startIndex === endIndex) {
      setState(ElementStates.Modified, start)
      stateSnapshotsList.push(cloneElements(elements))
      return stateSnapshotsList
    }

    if (startIndex === 0) {
      stateSnapshotsList.push(cloneElements(elements))
      setState(ElementStates.Changing, start, end)
      stateSnapshotsList.push(cloneElements(elements))
    }

    swap(elements, startIndex, endIndex)
    setState(ElementStates.Modified, start, end)


    if (nextStartIndex >= endIndex) {
      stateSnapshotsList.push(cloneElements(elements))
      return stateSnapshotsList
    }

    const nextStart = elements[nextStartIndex]
    const prevEnd = elements[prevEndIndex]
    setState(ElementStates.Changing, nextStart, prevEnd)
    stateSnapshotsList.push(cloneElements(elements))
    endIndex--
    startIndex++
  }
  return stateSnapshotsList
}