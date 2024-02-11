import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./stack-algorithm-viewer.module.css";
import {Buttons} from "../../types/buttons";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import {Stack, StackSnapshotStorage, IStateStack} from "./utils";

type TFormData = {
  inputValue: string;
}

export const StackAlgorithmViewer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [stack, setStack] = useState<Stack<string> | null>(null);
  const [caretakerStack, setCaretakerStack] = useState<StackSnapshotStorage<string> | null>(null);
  const [content, setContent] = useState<IStateStack<string> | null>(null)

  const initialInputValue = {inputValue: ""}

  const {values, handleChange, setValues} = useForm<TFormData>(initialInputValue);

  const delay: number = DELAY_IN_MS;
  const max: number = 4
  const isLimitText: boolean = true
  const isCanDelete = stack && stack.getSize() !== 0

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newStack = new Stack<string>();
    const newCaretakerStack = new StackSnapshotStorage<string>(newStack)
    const backup = () => {
      return newCaretakerStack && newCaretakerStack.createAndStoreSnapshot()
    }
    newStack && newStack.setBackup(backup)

    setStack(newStack)
    setCaretakerStack(newCaretakerStack)
  }, [])

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader]);

  //todo - Warning:(70, 6) ESLint: React Hook React.useEffect has missing dependencies: 'caretakerStack' and 'delay'.
  // Either include them or remove the dependency array. (react-hooks/exhaustive-deps)
  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (caretakerStack && !(caretakerStack.isEmpty())) {
      stepsTimeoutId = setTimeout(() => {
        const memento = caretakerStack.retrieveAndRemoveSnapshot()
        const step = memento && memento.getState()
        step && setContent(step);
      }, delay);
    }

    if (caretakerStack && caretakerStack.isEmpty()) {
      setIsLoader(null);
      caretakerStack.clear();
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [content]);

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    setIsLoader(Buttons.addTail)
    if (stack && caretakerStack) {
      stack.push(values.inputValue)
      const memento = caretakerStack.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setContent(step);
      setValues(initialInputValue)
    }
  }

  function handlerOnClickClear(): void {
    if (stack && caretakerStack) {
      const size = stack.getSize()
      if (size > 0) {
        stack.clearAll()
      }
      const memento = caretakerStack.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setContent(step);
    }
  }

  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteTail)
    if (stack && caretakerStack) {
      stack.pop()
      const memento = caretakerStack.retrieveAndRemoveSnapshot()
      const step = memento && memento.getState()
      step && setContent(step);
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

      {content &&
        <ul className={styles.containerResultStack}>
          {content.container.map((element, index) =>
            <li key={index}>
              <CircleMemo letter={String(element)}
                          index={index}
                          {...(index === content.activeIndex) && {state: ElementStates.Changing}}
                          {...(index === content.tailIndex) && {head: "top"}}
              />
            </li>
          )}
        </ul>}
    </>
  );
};