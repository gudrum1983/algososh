import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import React, {FormEvent, useRef, useState} from "react";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import useForm from "../../useForm";
import styles from "./container-fibonacci.module.css";
import {Buttons} from "../../types/buttons";
import {ICircleComponent} from "../../utils/circle";
import {
  createFibonacciAndSnapshots
} from "./create-fibonacci-and-snapshots/create-fibonacci-and-snapshots";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";

type TFormData = { inputValue: string; };

export const ContainerFibonacci = (): JSX.Element => {

  const [isLoader, setIsLoader] = useState<Buttons | null>(null);
  const [snapshots, setSnapshots] = useState<Array<Array<ICircleComponent>> | null>(null);
  const [memo, setMemo] = useState<Record<number, number> | null>(null);

  const inputInitialState = {inputValue: ""};
  const {values, handleChange} = useForm<TFormData>(inputInitialState);
  const inputRef = useRef<HTMLInputElement>(null);

  const delay = SHORT_DELAY_IN_MS;
  const max = 19
  const min = 1
  const stepNumber = 1
  const isLimitText: boolean = true;
  const isCorrectNumber = Number(values.inputValue) >= min && Number(values.inputValue) <= max;



  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader, snapshots]);


  function handleOnSubmitCreateFibonacci(e: FormEvent): void {
    e.preventDefault();
    if (values.inputValue) {
      const inputValue = Number(values.inputValue)
      setIsLoader(Buttons.fibonacci);
      const [memory, snapshotsList] = createFibonacciAndSnapshots(inputValue, memo);
      setSnapshots(snapshotsList);
      setMemo(memory);
    }
  }

  return (
    <>
      <form onSubmit={handleOnSubmitCreateFibonacci}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} max={`${max}`} type={"number"} placeholder={`Введите число от ${min} до ${max}`}
                 isLimitText={isLimitText} name={"inputValue"} tabIndex={0} value={values.inputValue}
                 onChange={handleChange} min={`${min}`} step={`${stepNumber}`}/>
          <Button type={"submit"} text={"Рассчитать"} isLoader={isLoader === Buttons.fibonacci} disabled={!isCorrectNumber}
                  name={Buttons.fibonacci}/>
        </fieldset>
      </form>

      {snapshots &&  <StepByStepDisplay<ICircleComponent> steps={snapshots} setLoader={setIsLoader}
                                                          delay={delay}/>}
    </>
  );
};