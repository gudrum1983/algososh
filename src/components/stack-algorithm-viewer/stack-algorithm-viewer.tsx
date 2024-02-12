import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./stack-algorithm-viewer.module.css";
import {Buttons} from "../../types/buttons";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import {Stack, StackSnapshotStorage, IStackState} from "./utils";

type TFormData = {
  inputValue: string;
}

export const StackAlgorithmViewer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [stack, setStack] = useState<Stack<string> | null>(null);
  const [stackSnapshotStorage, setStackSnapshotStorage] = useState<StackSnapshotStorage<string> | null>(null);
  const [stackState, setStackState] = useState<IStackState<string> | null>(null)

  const initialInputValue = {inputValue: ""}

  const {values, handleChange, setValues} = useForm<TFormData>(initialInputValue);

  const delay: number = DELAY_IN_MS;
  const max: number = 4
  const isLimitText: boolean = true
  const isCanDelete = stack && stack.getSize() !== 0

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newStack = new Stack<string>();
    const newStackSnapshotStorage = new StackSnapshotStorage<string>(newStack)
    const backup = () => {
      return newStackSnapshotStorage && newStackSnapshotStorage.createAndStoreSnapshot()
    }
    newStack && newStack.setBackup(backup)

    setStack(newStack)
    setStackSnapshotStorage(newStackSnapshotStorage)
  }, [])

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader]);

  //todo - Warning:(70, 6) ESLint: React Hook React.useEffect has missing dependencies: 'stackSnapshotStorage' and 'delay'.
  // Either include them or remove the dependency array. (react-hooks/exhaustive-deps)
  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (stackSnapshotStorage && !(stackSnapshotStorage.isEmpty())) {
      stepsTimeoutId = setTimeout(() => {
        const memento = stackSnapshotStorage.retrieveAndRemoveSnapshot()
        const step = memento && memento.getState()
        step && setStackState(step);
      }, delay);
    }

    if (stackSnapshotStorage && stackSnapshotStorage.isEmpty()) {
      setIsLoader(null);
      stackSnapshotStorage.clear();
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [stackState]);

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    setIsLoader(Buttons.addTail)
    if (stack && stackSnapshotStorage) {
      stack.push(values.inputValue)
      const memento = stackSnapshotStorage.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setStackState(step);
      setValues(initialInputValue)
    }
  }

  function handlerOnClickClear(): void {
    if (stack && stackSnapshotStorage) {
      const size = stack.getSize()
      if (size > 0) {
        stack.clearAll()
      }
      const memento = stackSnapshotStorage.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setStackState(step);
    }
  }

  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteTail)
    if (stack && stackSnapshotStorage) {
      stack.pop()
      const memento = stackSnapshotStorage.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setStackState(step);
    }
  }

  const CircleMemo = React.memo(Circle);

  
  return (
    <>
      <form className={styles.formStack} onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={max} isLimitText={isLimitText} onChange={handleChange} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader === Buttons.addTail}
                  name={Buttons.addTail} disabled={!values.inputValue}/>
          <Button text={"Удалить"} onClick={handlerOnClickDelete}
                  isLoader={isLoader === Buttons.deleteTail} name={Buttons.deleteTail} disabled={!isCanDelete}/>
          <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  isLoader={isLoader === Buttons.clear} name={Buttons.clear} disabled={!isCanDelete}/>
        </fieldset>
      </form>

      {stackState &&
        <ul className={styles.containerResultStack}>
          {stackState.container.map((element, index) =>
            <li key={index}>
              <CircleMemo letter={String(element)}
                          index={index}
                          {...(index === stackState.activeIndex) && {state: ElementStates.Changing}}
                          {...(index === stackState.tailIndex) && {head: "top"}}
              />
            </li>
          )}
        </ul>}
    </>
  );
};