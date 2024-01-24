import React, {FormEvent, useRef, useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {CircleBaseElement} from "../../types/element-and-snapshot";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {DELAY_IN_MS} from "../../constants/delays";
import {
  createStackSnaphotsClear,
  createStackSnaphotsPop,
  createStackSnaphotsPush,
  IStackWithSnapshots,
  StackWithSnapshots
} from "../../algorithms/create-stack-snaphots/create-stack-snaphots";
import {Circle} from "../../components/ui/circle/circle";
import useForm from "../../useForm";

export type TElementStack = Pick<CircleBaseElement,
  "letter"
  | "state"
  | "id"
  /*  | "tailType"
    | "tail"*/
  | "index"> & { top: boolean }

type TFormData = {
  inputValue: string;
}


export const StackPage: React.FC = () => {

    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [isLoader2, setIsLoader2] = useState<boolean>(false);
    const [snapshots, setSnapshots] = useState<Array<Array<TElementStack>> | null>(null);
    const [Stack1, setStack1] = useState<IStackWithSnapshots<TElementStack> | null>(null);


    const {values, handleChange} = useForm<TFormData>({
      inputValue: "",
    });

    const delay = DELAY_IN_MS;
    const max = 4

    const inputRef = useRef<HTMLInputElement>(null);


    React.useEffect(() => {
      const stack = new StackWithSnapshots<TElementStack>();
      setStack1(stack)
    }, [])

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

      if (Stack1) {
        createStackSnaphotsPush(Stack1, values.inputValue)
        values.inputValue = ""
        setSnapshots(Stack1.getHistory());
      }

    }


    function handlerOnClickClear(): void {
      if (Stack1) {
        createStackSnaphotsClear(Stack1)
        setSnapshots(null);
      }

    }


    function handlerOnClickDelete(): void {
      setIsLoader2(true)
      if (Stack1) {
        createStackSnaphotsPop(Stack1)
        setSnapshots(Stack1.getHistory());
      }

    }

    const CircleMemo = React.memo(Circle);

    const createContent = (elementsList: Array<TElementStack>) => {
      return (
        <ul className="container-result list">
          {elementsList.map((element) =>
            <li key={element.id}>
              <CircleMemo state={element.state} letter={element.letter} index={element.index} {...element.top && {
                head: "top"
              }}/>
            </li>
          )}
        </ul>
      );
    };

    return (
      <SolutionLayout title="Стек">

        <form className="container-inputs-buttons container_type_stack" onSubmit={sub}>
          <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange}
                 disabled={isLoader || isLoader2} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader} disabled={!values.inputValue}/>
          <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader2}
                  disabled={!Stack1?.getSize() || isLoader}/>
          <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  disabled={!Stack1?.getSize() || isLoader || isLoader2}/>
        </form>

        {snapshots &&
          <StepByStepDisplay<TElementStack> steps={snapshots}
                                            setLoader={isLoader ? setIsLoader : setIsLoader2}
                                            childComponent={createContent}
                                            delay={delay}/>}

      </SolutionLayout>
    );
  }
;
