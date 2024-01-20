import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Circle} from "../../components/ui/circle/circle";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {ElementStates} from "../../types/element-states";
import {generateReversedStringSnapshots} from "../../utils/reverse";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";

export type TElement = {
  value: string,
  state?: ElementStates
  id: string
}


export const StringComponent: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>("")
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [snapshots, setSnapshots] = useState<Array<Array<TElement>> | null>(null)

  function handlerOnClick():void {
    setIsLoader(true)
    const snapshotsList = generateReversedStringSnapshots(inputValue)
    setSnapshots(snapshotsList)
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>)  {
    setInputValue(e.target.value)
  }

  const CircleMemo = React.memo(Circle);

  const content = (elementsList: Array<TElement>) => {
    return (
      <ul className="container-result list">
        {elementsList.map((element) => <li key={element.id}><CircleMemo state={element.state} letter={element.value}/></li>)}
      </ul>
    );
  }

  return (
    <SolutionLayout title="Строка">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputValue} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputValue}/>
      </div>
      {snapshots &&
        <StepByStepDisplay<TElement> stateSnapshotsList={snapshots} setLoader={setIsLoader} content={content}/>}
    </SolutionLayout>
  );
};