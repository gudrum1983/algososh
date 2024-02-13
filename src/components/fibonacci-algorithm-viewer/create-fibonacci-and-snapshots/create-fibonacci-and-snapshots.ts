import {CircleElement, ICircleComponent} from "../../../utils/circle";

export function createFibonacciAndSnapshots(index: number, fibonacciCache: Record<number, number> | null):
  [Record<number, number>, Array<Array<ICircleComponent>>] {

  const snapshotsList: Array<Array<ICircleComponent>> = [];
  const snapshot: Array<ICircleComponent> = [];

  const mapHas: Record<number, number> = {...fibonacciCache, 0: 1, 1: 1};

  function calculateFibonacci(index: number): number {
    if (!(index in mapHas)) {
      mapHas[index] = calculateFibonacci(index - 1) + calculateFibonacci(index - 2);
    }
    return mapHas[index];
  }

  calculateFibonacci(index);

  for (let i = 0; i <= index; i++) {
    const numberFibonacci = new CircleElement(mapHas[i], i)
    snapshot[i] = numberFibonacci.getElement();
    //тут на каждой итерации массив snapshot пополняется на один элемент
    //и каждую итерацию новый вариант массива записывается в snapshotsList
    snapshotsList.push([...snapshot]);
  }

  return [mapHas, snapshotsList];
}