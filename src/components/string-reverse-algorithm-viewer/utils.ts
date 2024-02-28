import {cloneSnapElements, swap} from "../../utils/utils";
import {CircleElement, ICircleElement, IStateCircleElement} from "../../utils/circle";
import {Caretaker, Originator, TStateAndSnapshotStorage} from "../../utils/memento";

export const createStringReverseSnapshots = (string: string): TStateAndSnapshotStorage<IStateCircleElement> => {

  if (string === '') {
    throw new Error("String cannot be empty");
  }

  const elements: Array<ICircleElement> = string.split('').map((item, index) => new CircleElement(item, index));

  const initialState: Array<IStateCircleElement> = cloneSnapElements(elements);
  const state = new Originator<Array<IStateCircleElement>>(initialState);
  const snapshotStorage = new Caretaker<Array<IStateCircleElement>>(state);

  let startIndex = 0;
  let endIndex = elements.length - 1;

  while (startIndex <= endIndex) {
    const start = elements[startIndex];
    const end = elements[endIndex];
    const nextStartIndex = startIndex + 1;
    const prevEndIndex = endIndex - 1;
    if (startIndex === endIndex) {
      start.setModifiedState();
      state.setState(cloneSnapElements(elements));
      snapshotStorage.createAndStoreSnapshot();
      return {state, snapshotStorage};
    }

    if (startIndex === 0) {
      state.setState(cloneSnapElements(elements));
      snapshotStorage.createAndStoreSnapshot();
      start.setChangingState();
      end.setChangingState();
      state.setState(cloneSnapElements(elements));
      snapshotStorage.createAndStoreSnapshot();
    }

    swap(elements, startIndex, endIndex);
    start.setModifiedState();
    end.setModifiedState();

    if (nextStartIndex >= endIndex) {
      break;
    }

    const nextStart = elements[nextStartIndex];
    const prevEnd = elements[prevEndIndex];
    nextStart.setChangingState();
    prevEnd.setChangingState();
    state.setState(cloneSnapElements(elements));
    snapshotStorage.createAndStoreSnapshot();
    endIndex--;
    startIndex++;
  }
  state.setState(cloneSnapElements(elements));
  snapshotStorage.createAndStoreSnapshot();
  return {state, snapshotStorage};

};