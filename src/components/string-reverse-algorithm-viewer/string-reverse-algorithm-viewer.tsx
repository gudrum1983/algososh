import React, {FormEvent, useRef, useState} from "react";
import styles from "./string-reverse-algorithm-viewer.module.css"
import {Buttons} from "../../types/buttons";
import useForm from "../../useForm";
import {createStringReverseSnapshots, TContentString} from "./utils";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ICircleComponent} from "../../utils/circle";
import {StepByStepDisplay2} from "../step-by-step-display/step-by-step-display";

type TFormData = { inputValue: string; };
export const StringReverseAlgorithmViewer = (): JSX.Element => {

  const maxLength: number = 11;
  const isLimitText: boolean = true;

  const [isLoader, setIsLoader] = useState<Buttons | null>(null);

  const stateAndSnapshotsForVisualization = useRef<TContentString<ICircleComponent> | null>(null)

  const inputInitialValue = {inputValue: ""};
  const {values, handleChange} = useForm<TFormData>(inputInitialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader]);

  function handleOnSubmitReverseString(e: FormEvent): void {
    e.preventDefault();
    stateAndSnapshotsForVisualization.current = createStringReverseSnapshots(values.inputValue)
    setIsLoader(Buttons.reverse);
  }

  const state = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.newContent
  const snapshotStorage = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.newSimpleSnapshotStorage

  return (
    <>
      <form onSubmit={handleOnSubmitReverseString}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={maxLength} isLimitText={isLimitText} onChange={handleChange}
                 name={"inputValue"} value={values.inputValue}/>
          <Button type={"submit"} text={"Развернуть"} isLoader={isLoader === Buttons.reverse}
                  disabled={!values.inputValue} name={Buttons.reverse}/>
        </fieldset>
      </form>
      {state && snapshotStorage &&
        <StepByStepDisplay2<ICircleComponent> state={state} snapshotStorage={snapshotStorage}
                                              setLoader={setIsLoader}/>}
    </>
  );
};