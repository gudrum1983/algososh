import React, {FormEvent, useRef, useState} from "react";
import {Buttons, createStackItem} from "../../utils/utils";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {StepByStepDisplay3} from "../step-by-step-display/step-by-step-display3";
import styles from "./container-stack.module.css";
import {IStackWithSnapshots, StackWithSnapshots} from "../../algorithms/stack-with-snaphots/create-stack-snaphots";
import {CircleBaseElement} from "../../types/element-and-snapshot";
import {ElementStates} from "../../types/element-states";

type TFormData = {
  inputValue: string;
}

export type TElementStack = Pick<CircleBaseElement,
  "letter"
  | "state"
  | "id"
  | "index"> & { top: boolean }

export type TSnapshotStack = { containerStack: Array<TElementStack> };
export const ContainerStack: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [snapshots, setSnapshots] = useState<Array<TSnapshotStack> | null>(null);
  const [stack, setStack] = useState<IStackWithSnapshots<TElementStack> | null>(null);

  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay: number = DELAY_IN_MS;
  const max: number = 4
  const isLimitText: boolean = true

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const stack = new StackWithSnapshots<TElementStack>();
    setStack(stack)
  }, [])

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader, snapshots]);


  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    setIsLoader(Buttons.addTail)


    if (stack) {
      const index = stack.getSize()
      if (index > 0) {
        const topElement = stack.peak()
        if (topElement && topElement.top) {
          topElement.top = false
        }
      }
      stack.push(createStackItem(values.inputValue, ElementStates.Changing, index))
      stack.saveHistory()
      const currElement = stack.peak()
      if (currElement && currElement.state) {
        const item = {...currElement, state: ElementStates.Default}
        stack.changeLast(item)
      }
      stack.saveHistory()
      const stackHistory = stack.getHistory()
      const snapshotsStack = stackHistory?.map((steps) => {
        return {
          containerStack: steps
        }
      })
      setSnapshots(snapshotsStack);




    }
  }

  function handlerOnClickClear(): void {
    if (stack) {
      const size = stack.getSize()
      if (size > 0) {
        stack.clearAll()
      }
      setSnapshots(null);
    }
  }

  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteTail)
    if (stack) {
      const index = stack.getSize() - 1
      if (index < 0) {
        return
      }
      const last = stack.peak()
      if (last && last.state) {
        const item = {...last, state: ElementStates.Changing}
        stack.changeLast(item)
        stack.saveHistory()
      }
      stack.pop()
      const currElement = stack.peak()
      if (currElement && currElement.state) {
        const item = {...currElement, top: true}
        stack.changeLast(item)
      }
      stack.saveHistory()
      values.inputValue = ""
      const stackHistory = stack.getHistory()
      const snapshotsStack = stackHistory?.map((steps) => {
        return {
          containerStack: steps
        }
      })
      setSnapshots(snapshotsStack);
    }
  }

  return (
    <>
      <form className="container-inputs-buttons container_type_stack" onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={max} isLimitText={isLimitText} onChange={handleChange} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader === Buttons.addTail}
                  name={Buttons.addTail}/>
          <Button text={"Удалить"} onClick={handlerOnClickDelete}
                  isLoader={isLoader === Buttons.deleteTail} name={Buttons.deleteTail}/>
          <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  isLoader={isLoader === Buttons.clear} name={Buttons.clear}/>
        </fieldset>
      </form>
      {snapshots &&
        <StepByStepDisplay3<TSnapshotStack> steps={snapshots} setLoader={setIsLoader} delay={delay}/>}
    </>
  );
};