import React, {useState} from "react";
import { SolutionLayout } from "../../components/ui/solution-layout/solution-layout";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {TElement} from "../string/string";
import {generateReversedStringSnapshots} from "../../algorithms/reverse/reverse";
import {Circle} from "../../components/ui/circle/circle";

export const SortingPage: React.FC = () => {

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
    <SolutionLayout title="Сортировка массива">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputValue}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputValue}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputValue}/>
      </div>
      {snapshots &&
        <StepByStepDisplay<TElement> stateSnapshotsList={snapshots} setLoader={setIsLoader} content={content}/>}
    </SolutionLayout>
  )};
