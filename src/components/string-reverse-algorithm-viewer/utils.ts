import {cloneSnapElements, swap} from "../../utils/utils";
import {CircleElement, ICircleComponent, ICircleElement} from "../../utils/circle";
import {SimpleContent, SimpleSnapshotStorage} from "../../utils/simple-snapshot-storage";
import {IColumnComponent} from "../../utils/column";

export type TContentString<T extends ICircleComponent & IColumnComponent> = {
  newContent:SimpleContent<Array<T>>;
  newSimpleSnapshotStorage:SimpleSnapshotStorage<Array<T>>
}

export const createStringReverseSnapshots = (string: string):TContentString<ICircleComponent>  => {

  const initElements: Array<ICircleElement> = string.split('').map((item, index) => new CircleElement(item, index));
  const elements = initElements;

  const state: Array<ICircleComponent> = cloneSnapElements(elements);
  const newContent = new SimpleContent<Array<ICircleComponent>>(state);
  const newSimpleSnapshotStorage = new SimpleSnapshotStorage<Array<ICircleComponent>>(newContent);

  let startIndex = 0;
  let endIndex = elements.length - 1;

  while (startIndex <= endIndex) {
    const start = elements[startIndex];
    const end = elements[endIndex];
    const nextStartIndex = startIndex + 1;
    const prevEndIndex = endIndex - 1;

    if (startIndex === endIndex) {
      start.setModifiedState();
      newContent.setState(cloneSnapElements(elements));
      newSimpleSnapshotStorage.createAndStoreSnapshot();
      return {newContent, newSimpleSnapshotStorage};
    }

    if (startIndex === 0) {
      newContent.setState(cloneSnapElements(elements));
      newSimpleSnapshotStorage.createAndStoreSnapshot();
      start.setChangingState()
      end.setChangingState()
      newContent.setState(cloneSnapElements(elements));
      newSimpleSnapshotStorage.createAndStoreSnapshot();
    }

    swap(elements, startIndex, endIndex);
    start.setModifiedState()
    end.setModifiedState()

    if (nextStartIndex >= endIndex) {
      newContent.setState(cloneSnapElements(elements));
      newSimpleSnapshotStorage.createAndStoreSnapshot();
      return {newContent, newSimpleSnapshotStorage};
    }

    const nextStart = elements[nextStartIndex];
    const prevEnd = elements[prevEndIndex];
    nextStart.setChangingState()
    prevEnd.setChangingState()
    newContent.setState(cloneSnapElements(elements));
    newSimpleSnapshotStorage.createAndStoreSnapshot();
    endIndex--;
    startIndex++;
  }

  return {newContent, newSimpleSnapshotStorage};
}