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

  const [isLoader, setIsLoader] = useState<null |Buttons>(null);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapQueue<TElementQueue1>> | null>(null);
  const [Queue1, setQueue1] = useState<IQueueWithSnapshots<TElementQueue1> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const queue = new QueueWithSnapshots<TElementQueue1>(7);

    setQueue1(queue)


  }, [])

  React.useEffect(() => {
    if (Queue1) {

      const steps = Queue1.getHistory()

      setSnapshots(steps);
    }


  }, [Queue1])

  React.useEffect(() => {
    // Предполагая, что есть состояние, которое изменяется в handlerOnClickAdd
    // Например, это может быть состояние, отслеживающее, была ли нажата кнопка

    inputRef.current?.focus();

  }, [isLoader, snapshots]);

  function sub(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {

    setIsLoader(Buttons.addTail)
    if (Queue1) {

      const newItem = createQueueItem({letter: values.inputValue, state: ElementStates.Changing})
      Queue1.enqueue(newItem)

      values.inputValue = ""

      const steps = Queue1.getHistory()

      setSnapshots(steps);
    }


  }


  function handlerOnClickClear(): void {
    setIsLoader(Buttons.clear)
    if (Queue1) {

      const size = Queue1.getSize()

      if (size > 0) {

        Queue1.clear()

      }
      const steps = Queue1.getHistory()

      setSnapshots(steps);
    }
  }


  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteHead)
    if (Queue1) {
      const queueLength = Queue1.getLength()
      if (queueLength <= 0) {
        return
      }
      Queue1.dequeue()
      const steps = Queue1.getHistory()

      setSnapshots(steps);
    }
  }


  return (
    <>
      <form className="container-inputs-buttons container_type_stack" onSubmit={sub}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange}  tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader === Buttons.addTail}
                  name={Buttons.addTail}
                  disabled={!values.inputValue || Queue1?.getCanAdd()}/>
          <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader === Buttons.deleteHead}
                  name={Buttons.deleteHead}
                  disabled={!Queue1?.getCanDelete()}/>
          <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  isLoader={isLoader === Buttons.clear} name={Buttons.clear}
                  disabled={!Queue1?.getSize()}/>
        </fieldset>
      </form>
      {snapshots &&
        <StepByStepDisplay3<TNewSnapQueue<TElementQueue1>> steps={snapshots}
                                                           setLoader={setIsLoader}
                                                           delay={delay}/>}
    </>
  );
};