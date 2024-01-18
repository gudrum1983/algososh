const memo: Record<number, number> = {0: 0, 1: 1}


export function getFiboNumWithHistory(index: number, map: Record<number, number>): {fib:number, memo: Record<number, number> }  {

  if (index in map) {
    return {fib:map[index], memo: map}
  }

  const mapHas = JSON.parse(JSON.stringify(map));

  function fibomacci(index: number): number {

    if (!(index in mapHas)) {
      mapHas[index] = fibomacci(index - 1) + fibomacci(index - 2)
    }

    return mapHas[index]
  }

  return   {fib:fibomacci(index), memo: mapHas }
}


console.log(getFiboNumWithHistory(7, memo))