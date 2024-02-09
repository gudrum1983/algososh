import {TSnapshotFibonacci} from "../../components/container-fibonacci/container-fibonacci";
import {nanoid} from "nanoid";

export function createFibonacciAndSnapshots(index: number, fibonacciCache: Record<number, number> | null):
  [Record<number, number>, Array<TSnapshotFibonacci>] {

  const snapshotsList: Array<TSnapshotFibonacci> = [];
  const snapshot: TSnapshotFibonacci = {containerFibonacci: []};

  const mapHas: Record<number, number> = {...fibonacciCache, 0: 1, 1: 1};

  function calculateFibonacci(index: number): number {
    if (!(index in mapHas)) {
      mapHas[index] = calculateFibonacci(index - 1) + calculateFibonacci(index - 2);
    }
    return mapHas[index];
  }

  calculateFibonacci(index);

  for (let i = 0; i <= index; i++) {
    snapshot.containerFibonacci[i] = {letter: String(mapHas[i]), index: i, id: nanoid(5)}
    //тут на каждой итерации массив snapshot пополняется на один элемент
    //и каждую итерацию новый вариант массива записывается в snapshotsList
    snapshotsList.push({containerFibonacci: [...snapshot.containerFibonacci]});
  }

  return [mapHas, snapshotsList];
}