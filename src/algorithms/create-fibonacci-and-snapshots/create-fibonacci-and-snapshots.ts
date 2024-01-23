import {TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";
import {createElementFibonacci} from "../../utils/utils";
import {TElementFibonacci} from "../../pages/fibonacci-page/fibonacci-page";

export function createFibonacciAndSnapshots(index: number, fibonacciCache: Record<number, number> | null):
  [Record<number, number>, TSnapshotsList<TElementFibonacci>] {

  const snapshotsList: TSnapshotsList<TElementFibonacci> = [];
  const snapshot: TSnapshot<TElementFibonacci> = [];

  const mapHas: Record<number, number> = {...fibonacciCache, 0: 1, 1: 1};

  function calculateFibonacci(index: number): number {
    if (!(index in mapHas)) {
      mapHas[index] = calculateFibonacci(index - 1) + calculateFibonacci(index - 2);
    }
    return mapHas[index];
  }

  calculateFibonacci(index);

  for (let i = 0; i <= index; i++) {
    snapshot[i] = createElementFibonacci(String(mapHas[i]), i);
    //тут на каждой итерации массив snapshot пополняется на один элемент
    //и каждую итерацию новый вариант массива записывается в snapshotsList
    snapshotsList.push([...snapshot]);
  }

  return [mapHas, snapshotsList];
}