import React, {FormEvent, useRef, useState} from "react";
import {TElementQueue1} from "../../utils/utils";
import {
  createGueueSnaphotsClear,
  createQueneSnaphotsPush, createQueueSnaphotsPop,
  initialState,
  IQueueWithSnapshots, QueueWithSnapshots, TNewSnap
} from "../../algorithms/create-queue-snaphots/create-gueue-snaphots";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {StepByStepDisplay2} from "../step-by-step-display/step-by-step-display2";

type TFormData = {
  inputValue: string;
}


export const QueueContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoader2, setIsLoader2] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<TNewSnap<TElementQueue1>> | null>(null);
  const [Queue1, setQueue1] = useState<IQueueWithSnapshots<TElementQueue1> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const queue  = new QueueWithSnapshots<TElementQueue1>(7);

    setQueue1(queue)


  }, [])

  React.useEffect(() => {
    if (Queue1) {
      initialState(Queue1)
      setSnapshots(Queue1.getHistory())
    }


  }, [Queue1])

  React.useEffect(() => {
    // Предполагая, что есть состояние, которое изменяется в handlerOnClickAdd
    // Например, это может быть состояние, отслеживающее, была ли нажата кнопка

    inputRef.current?.focus();

  }, [isLoader, isLoader2, snapshots]);

  function sub(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    setIsLoader(true)

    if (Queue1) {

      createQueneSnaphotsPush(Queue1, values.inputValue)
      values.inputValue = ""
      setSnapshots(Queue1.getHistory());
    }

  }


  function handlerOnClickClear(): void {
    if (Queue1) {
      createGueueSnaphotsClear(Queue1)
      setSnapshots(Queue1.getHistory());
    }

  }


  function handlerOnClickDelete(): void {
    setIsLoader2(true)
    if (Queue1) {
           createQueueSnaphotsPop(Queue1)
      setSnapshots(Queue1.getHistory());
    }

  }

  const CircleMemo = React.memo(Circle);

  const createContent = (elementsList: TNewSnap<TElementQueue1>) => {
    console.log({"Head":elementsList.head, "Tail":elementsList.tail,"size":elementsList.size,"lenght":elementsList.length,})
    return (
      <ul className="container-result list">
        {elementsList.container.map((element, index) =>
          <li key={index}>
            {!element && <CircleMemo state={ElementStates.Default} letter={""} index={index} {...index === elementsList.head && index !== 0 && {
              head: "head"
            }}/>}
            {element &&
              <CircleMemo state={element.state} letter={element.letter} index={index} {...index === elementsList.head && {
                head: "head"
              }} {...index === elementsList.tail - 1 && {
                tail: "tail"
              }}/>}
          </li>)}
      </ul>
    );
  };

  return (
    <>
      <form className="container-inputs-buttons container_type_stack" onSubmit={sub}>
        <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange}
               disabled={isLoader || isLoader2} tabIndex={0}
               value={values.inputValue} name='inputValue'/>
        <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader} disabled={isLoader2 || !values.inputValue || Queue1?.getCanAdd()}/>
        <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader2}
                disabled={!Queue1?.getCanDelete() || isLoader}/>
        <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                disabled={!Queue1?.getSize() || isLoader || isLoader2}/>
      </form>

      {snapshots &&
        <StepByStepDisplay2<TNewSnap<TElementQueue1>> steps={snapshots}
                                                  setLoader={isLoader ? setIsLoader : setIsLoader2}
                                                  childComponent={createContent}
                                                  delay={delay}/>}
    </>
  );
};