import {CircleElement, ICircleComponent} from "../../utils/circle";
import {
  SimpleContent,
  SimpleSnapshotStorage,
  TSimpleStateAndSnapshotStirage
} from "../../utils/simple-snapshot-storage";

export function createFibonacciAndSnapshots(index: number, fibonacciCache: React.MutableRefObject<Record<number, number>>)
  : TSimpleStateAndSnapshotStirage<ICircleComponent> {

  const state = new SimpleContent<Array<ICircleComponent>>([]);
  const snapshotStorage = new SimpleSnapshotStorage<Array<ICircleComponent>>(state);

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