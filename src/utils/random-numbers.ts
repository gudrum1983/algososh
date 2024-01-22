type TParamsRandomNumbers = {
  minLen : number,
  maxLen : number,
  maxValue : number
}

export function randomNumbers(params?: TParamsRandomNumbers): Array<number> {

  const { minLen = 3, maxLen = 17, maxValue = 100 } = params || {};

  const randomLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen

  const randomNumber = () => {
    return Math.floor(Math.random() * maxValue)
  }
  return Array.from({length: randomLength}, randomNumber);
}