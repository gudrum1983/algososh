import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Circle} from "../../components/ui/circle/circle";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {ElementStates} from "../../types/element-states";
import {getReverseArrayWithHistory} from "../../utils/reverse";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";

export type TElement = {
  value: string,
  state: ElementStates
  id: string
}

export type TElements = Array<TElement>

export type TSnapshots<T> = Array<T>

export const StringComponent: React.FC = () => {

  const [inputString, setInputString] = useState<string>("")
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [snapshots, setSnapshots] = useState<TSnapshots<TElements> | null>(null)

  function handlerOnClick():void {
    setIsLoader(true)
    const snapshotsList = getReverseArrayWithHistory(inputString)
    setSnapshots(snapshotsList)
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>)  {
    setInputString(e.target.value)
  }

  const CircleMemo = React.memo(Circle);

  const content = (elementsList: TElements) => {
    return (
      <>
        {elementsList.map((element) => <li key={element.id}><CircleMemo state={element.state} letter={element.value}/></li>)}
      </>
    );
  }

  return (
    <SolutionLayout title="Строка">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputString} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputString}/>
      </div>
      {snapshots &&
        <StepByStepDisplay stateSnapshotsList={snapshots} setLoader={setIsLoader} content={content}/>}
    </SolutionLayout>
  );
};