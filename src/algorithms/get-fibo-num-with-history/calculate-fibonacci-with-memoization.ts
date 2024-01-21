import {nanoid} from "nanoid";
import {TElementFibb} from "../../pages/fibonacci-page/fibonacci-page";

export function calculateFibonacciWithMemoization(index: number,
                                                  fibonacciCache: Record<number, number> | null):
  [Record<number, number>, Array<Array<TElementFibb>>] {

  if (fibonacciCache && index in fibonacciCache) {
    const test = createHisrory(fibonacciCache, index)

    return [fibonacciCache, test]
  }

  const mapHas: Record<number, number> = fibonacciCache ? {...fibonacciCache} : {0: 1, 1: 1};

  function fibonacciNumbers(index: number, mapHas: Record<number, number>): number {

    if (!(index in mapHas)) {

      mapHas[index] = fibonacciNumbers(index - 1, mapHas) + fibonacciNumbers(index - 2, mapHas)
    }
    return mapHas[index]
  }

  fibonacciNumbers(index, mapHas)

  const snapshotsList = createHisrory(mapHas, index)


  return [mapHas, snapshotsList]
}

function createHisrory(mapHas: Record<number, number>, index: number) {

  const snapshotsList: Array<Array<TElementFibb>> = []

  const snapshotsItem: Array<TElementFibb> = []

  let i = 0

  while (i <= index) {

    snapshotsItem[i] = {
      value: mapHas[i],
      id: nanoid(5),
      order: i
    }


    snapshotsList.push([...snapshotsItem]);
    i++


  }


  return snapshotsList

}