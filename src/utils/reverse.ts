import {ElementStates} from "../types/element-states";
import {TElements} from "../pages/string/string";
import {cloneElements, setState, swap} from "./utils";
import { v4 as uuidv4 } from 'uuid';

export const getReverseArrayWithHistory = (string: string): [Array<TElements>, TElements, TElements] => {

  //Массив элементов созданных из каждого символа строки
  const initElements: TElements = string.split('').map((item) => ({
    value: item,
    state: ElementStates.Default,
    id: uuidv4()
  }))

  //Копия массива initElements для сортировки
  const elements = cloneElements(initElements);

  //Массив для хранения истории разворота
  const reversalHistory: Array<TElements> = []

  let startIndex = 0
  let endIndex = elements.length - 1


  //указатель на начальный/левый индекс
  /*  let start = startIndex*/
  //указатель на конечный/правый индекс
  /*  let end = endIndex*/

  while (startIndex <= endIndex) {

    const start = elements[startIndex]
    const end = elements[endIndex]
    const nextStartIndex = startIndex + 1
    const prevEndIndex = endIndex - 1


    if (startIndex === endIndex ) {
      setState(ElementStates.Modified, start)
      reversalHistory.push([{...start}])
      return endIndex === 0 ? ([reversalHistory, elements, elements]) : ([reversalHistory, elements, initElements])
    }

    if (startIndex === 0) {
      setState(ElementStates.Changing, start, end)
      reversalHistory.push([{...start},{...end}])
    }

    swap(elements, startIndex, endIndex)
    setState(ElementStates.Modified, start, end)


    if (nextStartIndex >= endIndex) {
      reversalHistory.push([{...start},{...end}])
      return [reversalHistory, elements, initElements]
    }

    const nextStart = elements[nextStartIndex]
    const prevEnd = elements[prevEndIndex]
    setState(ElementStates.Changing, nextStart, prevEnd)


    reversalHistory.push([
      {...start},
      {...end},
      {...nextStart},
      {...prevEnd},
    ])

    endIndex--
    startIndex++
  }

  return [reversalHistory, elements, initElements]
}