import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Circle} from "../../components/ui/circle/circle";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {ElementStates} from "../../types/element-states";
import {reverseWithHistory, TCheck} from "../../utils/reverse";
import {Queue} from "../../utils/queue";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";

export type TItem = {
  value: string,
  number: number,
  state: ElementStates
}

export const StringComponent: React.FC = () => {

  const [inputString, setInputString] = useState<string>("")
  const [isLoader, setIsLoader] = useState(false)

  const [letters, setLetters] = useState<Array<TItem> | null>(null)


  function handlerOnClick() {

    if (inputString) {
      setIsLoader(true)
      const mappingLetters = inputString.split('').map((item, index) => ({
        number: index,
        value: item,
        state: ElementStates.Default
      }))
      setLetters(mappingLetters)
    }
  }

  const reverseQueue = React.useMemo(() => {
    if (letters) {
      const historyRe = reverseWithHistory(letters)

      const stepsQueue = new Queue<TCheck>(20, historyRe)

/*      const stepsQueue = new Queue<TCheck>(20)
      reverseWithHistory(letters, stepsQueue)*/
      console.log("newStepQueue", stepsQueue)
      if (stepsQueue) {
        setIsLoader(false)
      }
      return stepsQueue
    }
    return null
  }, [letters])

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputString(e.target.value)
  }

  const content = (arr1: Array<TItem>) => {return (
    <ul className="container-result list">
      {arr1.map((item) => <li key={item.number}><Circle state={item.state} letter={item.value} /></li>)}
    </ul>
  );}

  return (
    <SolutionLayout title="Строка">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputString} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputString}/>
      </div>
        {reverseQueue && letters &&
          <StepByStepDisplay data={letters} stepsQueue={reverseQueue} setLoader={setIsLoader} content={content}/>}

    </SolutionLayout>
  );
};

