import {ElementStates} from "../types/element-states";
import {Elements} from "../pages/string/string";
import {allEqual, cloneElements, setChanging, setModified} from "./utils";

export const getReverseArrayWithHistory = (string: string): [Array<Elements>, Elements, Elements] => {

  //Массив элементов созданных из каждого символа строки
  const initElements: Elements = string.split('').map((item, index) => ({
    number: index,
    value: item,
    state: ElementStates.Default
  }))

  //Копия массива initElements для сортировки
  const elements = cloneElements(initElements);

  //Массив для хранения истории разворота
  const reversalHistory: Array<Elements> = []

  const startIndex = 0
  const endIndex = elements.length - 1


  //указатель на начальный/левый индекс
  let leftPointer = startIndex
  //указатель на конечный/правый индекс
  let rightPointer = endIndex

  while (leftPointer <= rightPointer) {

    const leftElement = elements[leftPointer]
    const rightElement = elements[rightPointer]

    if (allEqual(leftPointer, rightPointer, 0)) {
      setModified(elements[leftPointer])
      return [reversalHistory, elements, elements]
    }

    if (allEqual(leftPointer, startIndex) || allEqual(rightPointer, endIndex)) {
      setChanging(elements[leftPointer], elements[rightPointer])
      reversalHistory.push([{...elements[leftPointer]}, {...elements[rightPointer]}])
    }

    setModified(leftElement, rightElement)


    if (leftPointer + 1 >= rightPointer) {
      reversalHistory.push([{...leftElement}, {...rightElement}])
      return [reversalHistory, elements, initElements]
    }

    const nextStart = elements[leftPointer + 1]
    const prevEnd = elements[rightPointer - 1]

    setChanging(nextStart, prevEnd)

    reversalHistory.push([{...leftElement}, {...rightElement}, {...nextStart}, {...prevEnd}])

    rightPointer--
    leftPointer++
  }

  return [reversalHistory, elements, initElements]
}


