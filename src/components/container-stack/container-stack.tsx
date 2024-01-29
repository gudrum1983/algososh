import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";
import styles from "./container-stack.module.css";
import {IStackWithSnapshots, StackWithSnapshots} from "../../algorithms/stack-with-snaphots/create-stack-snaphots";
import {CircleBaseElement} from "../../types/base-element";
import {ElementStates} from "../../types/element-states";
import {Buttons} from "../../types/buttons";
import {nanoid} from "nanoid";

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

  const initialInputValue = {inputValue: ""}

  const {values, handleChange, setValues} = useForm<TFormData>(initialInputValue);

  const delay: number = DELAY_IN_MS;
  const max: number = 4
  const isLimitText: boolean = true

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newStack = new StackWithSnapshots<TElementStack>();
    setStack(newStack)
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
      const newStackItem = {
        letter: values.inputValue,
        index: index,
        id: nanoid(5),
        state: ElementStates.Changing,
        top: true,
      }
      stack.push(newStackItem)
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
      setValues(initialInputValue)
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
      <form className={styles.formStack} onSubmit={disableFormSubmission}>
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
        <StepByStepDisplay<TSnapshotStack> steps={snapshots} setLoader={setIsLoader} delay={delay}/>}
    </>
  );
};