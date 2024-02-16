import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import React, {FormEvent, useRef, useState} from "react";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import useForm from "../../useForm";
import styles from "./fibonacci-algorithm-viewer.module.css";
import {Buttons} from "../../types/buttons";
import {IStateCircleElement} from "../../utils/circle";
import {createFibonacciAndSnapshots} from "./utils";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";

import {TStateAndSnapshotStorage} from "../../utils/memento";

type TFormData = { inputValue: string; };

export const FibonacciAlgorithmViewer = (): JSX.Element => {

  const [isLoader, setIsLoader] = useState<Buttons | null>(null);

  const stateAndSnapshotsForVisualization = useRef<TStateAndSnapshotStorage<IStateCircleElement> | null>(null);
  const memoFibonacci = useRef<Record<number, number>>({});

  const inputInitialState = {inputValue: ""};
  const {values, handleChange} = useForm<TFormData>(inputInitialState);
  const inputRef = useRef<HTMLInputElement>(null);

  const delay = SHORT_DELAY_IN_MS;
  const max = 19;
  const min = 1;
  const stepNumber = 1;
  const isLimitText: boolean = true;
  const isCorrectNumber = Number(values.inputValue) >= min && Number(values.inputValue) <= max;

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader]);

  function handleOnSubmitCreateFibonacci(e: FormEvent): void {
    e.preventDefault();
    if (values.inputValue) {
      const inputValue = Number(values.inputValue);
      setIsLoader(Buttons.fibonacci);
      stateAndSnapshotsForVisualization.current = createFibonacciAndSnapshots(inputValue, memoFibonacci);
    }
  }

  const state = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.state;
  const snapshotStorage = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.snapshotStorage;

  const ButtonMemo = React.memo(Button);

  return (
    <>
      <form onSubmit={handleOnSubmitCreateFibonacci}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} max={`${max}`} type={"number"} placeholder={`Введите число от ${min} до ${max}`}
                 isLimitText={isLimitText} name={"inputValue"} tabIndex={0} value={values.inputValue}
                 onChange={handleChange} min={`${min}`} step={`${stepNumber}`}/>
          <ButtonMemo type={"submit"} text={"Рассчитать"} isLoader={isLoader === Buttons.fibonacci}
                  disabled={!isCorrectNumber}
                  name={Buttons.fibonacci}/>
        </fieldset>
      </form>

      {state && snapshotStorage && <StepByStepDisplay<IStateCircleElement> state={state} snapshotStorage={snapshotStorage}
                                                                           setLoader={setIsLoader} delay={delay}/>}
    </>
  );
};