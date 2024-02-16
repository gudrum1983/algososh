import {CircleElement, IStateCircleElement} from "../../utils/circle";
import {
  Originator,
  Caretaker,
  TStateAndSnapshotStorage
} from "../../utils/memento";

export function createFibonacciAndSnapshots(index: number, fibonacciCache: React.MutableRefObject<Record<number, number>>)
  : TStateAndSnapshotStorage<IStateCircleElement> {

  const state = new Originator<Array<IStateCircleElement>>([]);
  const snapshotStorage = new Caretaker<Array<IStateCircleElement>>(state);

  if (!fibonacciCache.current.hasOwnProperty(1)) {
    fibonacciCache.current = {0: 1, 1: 1};
  }

  function calculateFibonacci(index: number): number {
    if (!(index in fibonacciCache.current)) {
      fibonacciCache.current[index] = calculateFibonacci(index - 1) + calculateFibonacci(index - 2);
    }
    return fibonacciCache.current[index];
  }

  calculateFibonacci(index);

  for (let i = 0; i <= index; i++) {
    const numberFibonacci = new CircleElement(fibonacciCache.current[i], i);
    let copyState = [...state.getState()];
    copyState.push(numberFibonacci.getElement());
    state.setState(copyState);
    snapshotStorage.createAndStoreSnapshot();
  }

  return {state, snapshotStorage};
}