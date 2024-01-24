import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Circle} from "../../components/ui/circle/circle";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {
  createStringInversionSnapshots
} from "../../algorithms/create-string-inversion-snapshots/create-string-inversion-snapshots";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {CircleBaseElement} from "../../types/element-and-snapshot";

export type TElementString = Pick<CircleBaseElement, "letter" | "state" | "id">
export const StringPage: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>("");
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<Array<TElementString>> | null>(null);

  function handlerOnClick(): void {
    setIsLoader(true);
    const stringInversionSnapshots = createStringInversionSnapshots(inputValue);
    setSnapshots(stringInversionSnapshots);
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  const CircleMemo = React.memo(Circle);

  const createContent = (elementsList: Array<TElementString>) => {
    return (
      <ul className="container-result list">
        {elementsList.map((element) =>
          <li key={element.id}>
            <CircleMemo state={element.state} letter={element.letter}/>
          </li>
        )}
      </ul>
    );
  };

  return (
    <SolutionLayout title="Строка">
      <div role="form" className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputValue} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputValue}/>
      </div>
      {snapshots &&
        <StepByStepDisplay<TElementString> steps={snapshots} setLoader={setIsLoader} childComponent={createContent}/>}
    </SolutionLayout>
  );
};