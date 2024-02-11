import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {ElementStates} from "../../types/element-states";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";
import styles from "./queue-algorithm-viewer.module.css";
import {CircleBaseElement} from "../../types/base-element";
import {nanoid} from "nanoid";
import {Buttons} from "../../types/buttons";
import {IQueueWithSnapshots, QueueWithSnapshots, TNewSnapQueue} from "./utils";

type TFormData = {inputValue: string};
export type TElementQueue = Pick<CircleBaseElement, "letter" | "state" | "id">
export type TSnapshotQueue = TNewSnapQueue<TElementQueue>;
export const QueueAlgorithmViewer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [snapshots, setSnapshots] = useState<Array<TSnapshotQueue> | null>(null);
  const [queue, setQueue] = useState<IQueueWithSnapshots<TElementQueue> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newQueue = new QueueWithSnapshots<TElementQueue>(7);
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
      const newItem: TElementQueue =  {
          letter: values.inputValue,
          state: ElementStates.Changing,
          id: nanoid(5),

      }
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
        <StepByStepDisplay<TNewSnapQueue<TElementQueue>> steps={snapshots}
                                                          setLoader={setIsLoader}
                                                          delay={delay}/>}
    </>
  );
};