import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Circle} from "../../components/ui/circle/circle";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {ElementStates} from "../../types/element-states";
import {getReverseArrayWithHistory} from "../../utils/reverse";
import {Queue} from "../../utils/queue";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";

export type Element = {
  value: string,
  number: number,
  state: ElementStates
}

export type Elements = Array<Element>

export const StringComponent: React.FC = () => {

  const [inputString, setInputString] = useState<string>("")
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [initialElements, setInitialElements] = useState<Elements | null>(null)
  const [resultReverse, setResultReverse] = useState<Elements | null>(null)
  const [reversalHistory, setReversalHistory] = useState<Array<Elements> | null>(null)


  function handlerOnClick():void {
    setIsLoader(true)
    const [historyReverse, reversedElement, initialElement] = getReverseArrayWithHistory(inputString)
    setInitialElements(initialElement)
    setResultReverse(reversedElement)
    setReversalHistory(historyReverse)
  }

  const reverseQueue = React.useMemo(() => {
    if (reversalHistory) {
      return new Queue<Elements>(10, reversalHistory)
    }
    return null
  }, [resultReverse])

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>)  {
    setInputString(e.target.value)
  }

  const content = (elementsList: Elements) => {
    return (
      <ul className="container-result list">
        {elementsList.map((element) => <li key={element.number}><Circle state={element.state} letter={element.value}/></li>)}
      </ul>
    );
  }

  return (
    <SolutionLayout title="Строка">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputString} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputString}/>
      </div>
      {reverseQueue && initialElements &&
        <StepByStepDisplay data={initialElements} stepsQueue={reverseQueue} setLoader={setIsLoader} content={content}/>}

    </SolutionLayout>
  );
};

