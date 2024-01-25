import React, {FormEvent, useRef, useState} from "react";
import {TElementQueue1} from "../../utils/utils";
import {
  createQueneSnaphotsPush,
  initialState,
  IQueueWithSnapshots,
  QueueWithSnapshots
} from "../../algorithms/create-queue-snaphots/create-gueue-snaphots";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";

type TFormData = {
  inputValue: string;
}

export const QueueContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoader2, setIsLoader2] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<Array<TElementQueue1 | null>> | null>(null);
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
      /*      createStackSnaphotsClear(Queue1)*/
      setSnapshots(null);
    }

  }


  function handlerOnClickDelete(): void {
    setIsLoader2(true)
    if (Queue1) {
      /*      createStackSnaphotsPop(Queue1)*/
      setSnapshots(Queue1.getHistory());
    }

  }

  const CircleMemo = React.memo(Circle);

  const createContent = (elementsList: Array<TElementQueue1 | null>) => {
    return (
      <ul className="container-result list">
        {elementsList.map((element, index) =>
          <li key={index}>
            {!element && <CircleMemo state={ElementStates.Default} letter={""} index={index}/>}
            {element &&
              <CircleMemo state={element.state} letter={element.letter} index={index} {...element.head && {
                head: "head"
              }} {...element.tail && {
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
        <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader} disabled={!values.inputValue}/>
        <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader2}
                disabled={!Queue1?.getSize() || isLoader}/>
        <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                disabled={!Queue1?.getSize() || isLoader || isLoader2}/>
      </form>

      {snapshots &&
        <StepByStepDisplay<TElementQueue1 | null> steps={snapshots}
                                                  setLoader={isLoader ? setIsLoader : setIsLoader2}
                                                  childComponent={createContent}
                                                  delay={delay}/>}
    </>
  );
};