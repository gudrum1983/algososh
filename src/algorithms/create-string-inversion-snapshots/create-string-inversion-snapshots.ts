import {ElementStates} from "../../types/element-states";
import {cloneElements, setState, swap} from "../../utils/utils";
import {TElementReverseString, TSnapshotReverseString} from "../../components/container-string/container-string";
import {nanoid} from "nanoid";

export const createStringInversionSnapshots = (string: string): Array<TSnapshotReverseString> => {

  const initElements: Array<TElementReverseString> = string.split('').map((item) => ({
    letter: item,
    state: ElementStates.Default,
    id: nanoid(5),
  }));

  const elements = cloneElements(initElements);
  const snapshotsList: Array<TSnapshotReverseString> = [];

  let startIndex = 0;
  let endIndex = elements.length - 1;

  while (startIndex <= endIndex) {

    const start = elements[startIndex];
    const end = elements[endIndex];
    const nextStartIndex = startIndex + 1;
    const prevEndIndex = endIndex - 1;

    if (startIndex === endIndex) {
      setState(ElementStates.Modified, start);
      snapshotsList.push({containerString:cloneElements(elements)});
      return snapshotsList;
    }

    if (startIndex === 0) {
      snapshotsList.push({containerString:cloneElements(elements)});
      setState(ElementStates.Changing, start, end);
      snapshotsList.push({containerString:cloneElements(elements)});
    }

    swap(elements, startIndex, endIndex);
    setState(ElementStates.Modified, start, end);

    if (nextStartIndex >= endIndex) {
      snapshotsList.push({containerString:cloneElements(elements)});
      return snapshotsList;
    }

    const nextStart = elements[nextStartIndex];
    const prevEnd = elements[prevEndIndex];
    setState(ElementStates.Changing, nextStart, prevEnd);
    snapshotsList.push({containerString:cloneElements(elements)});
    endIndex--;
    startIndex++;
  }
  return snapshotsList;
}