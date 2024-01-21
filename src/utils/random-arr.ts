export function randomArr({minLen = 3, maxLen = 17, maxValue = 100}) {

  const randomLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen

  const randomNumber = () => {
    return Math.floor(Math.random() * maxValue)
  }

  return Array.from({length: randomLength}, randomNumber);

}