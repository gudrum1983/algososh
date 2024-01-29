import React, {FormEvent, useRef, useState} from "react";
import {Buttons, createQueueItem, TElementQueue1} from "../../utils/utils";
import {
  IQueueWithSnapshots,
  QueueWithSnapshots,
  TNewSnapQueue
} from "../../algorithms/queue-with-snaphots/gueue-with-snaphots";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {ElementStates} from "../../types/element-states";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";

import {StepByStepDisplay3} from "../step-by-step-display/step-by-step-display3";
import styles from "./container-queue.module.css";

type TFormData = {
  inputValue: string;
}

export const ContainerQueue: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapQueue<TElementQueue1>> | null>(null);
  const [queue, setQueue] = useState<IQueueWithSnapshots<TElementQueue1> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newQueue = new QueueWithSnapshots<TElementQueue1>(7);
    setQueue(newQueue)
  }, [])

  React.useEffect(() => {
    if (queue) {
      const steps = queue.getHistory()
      setSnapshots(steps);
    }
  }, [queue])

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader, snapshots]);

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    setIsLoader(Buttons.addTail)
    if (queue) {
      const newItem = createQueueItem({letter: values.inputValue, state: ElementStates.Changing})
      queue.enqueue(newItem)
      values.inputValue = ""
      const steps = queue.getHistory()
      setSnapshots(steps);
    }
  }


  function handlerOnClickClear(): void {
    setIsLoader(Buttons.clear)
    if (queue) {
      const size = queue.getSize()
      if (size > 0) {
        queue.clear()
      }
      const steps = queue.getHistory()
      setSnapshots(steps);
    }
  }


  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteHead)
    if (queue) {
      const queueLength = queue.getLength()
      if (queueLength <= 0) {
        return
      }
      queue.dequeue()
      const steps = queue.getHistory()
      setSnapshots(steps);
    }
  }


  return (
    <>
      <form className={styles.formQueue} onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader === Buttons.addTail}
                  name={Buttons.addTail}
                  disabled={!values.inputValue || queue?.getCanAdd()}/>
          <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader === Buttons.deleteHead}
                  name={Buttons.deleteHead}
                  disabled={!queue?.getCanDelete()}/>
          <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  isLoader={isLoader === Buttons.clear} name={Buttons.clear}
                  disabled={!queue?.getSize()}/>
        </fieldset>
      </form>
      {snapshots &&
        <StepByStepDisplay3<TNewSnapQueue<TElementQueue1>> steps={snapshots}
                                                           setLoader={setIsLoader}
                                                           delay={delay}/>}
    </>
  );
};