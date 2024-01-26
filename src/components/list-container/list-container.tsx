import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ILinkedList, LinkedList, TNewSnapList} from "../../utils/linked-list";
import {createListItem, TElementList} from "../../utils/utils";
import {StepByStepDisplay2} from "../step-by-step-display/step-by-step-display2";
import {LinkedListNode} from "../../utils/linked-list-node";

type TFormData = {
  inputValue: string;
}

export const ListContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoader2, setIsLoader2] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapList<TElementList>> | null>(null);
  const [list, setList] = useState<ILinkedList<TElementList> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

  const inputRef = useRef<HTMLInputElement>(null);

 function createNode(element: TElementList): LinkedListNode<TElementList> {
    return new LinkedListNode(element);
  }



  React.useEffect(() => {

    const initialDate: Array<LinkedListNode<TElementList>> = []
    initialDate.push(createNode(createListItem("I--0")))
    initialDate.push(createNode(createListItem("I--1")))
    initialDate.push(createNode(createListItem("I--2")))
    initialDate.push(createNode(createListItem("I--3")))
    initialDate.push(createNode(createListItem("I--4")))
    initialDate.push(createNode(createListItem("I--5")))

    const list  = new LinkedList<TElementList>(initialDate);



    setList(list)
  }, [])

  React.useEffect(() => {
    if (list) {
      const rer = list.getSnap()
      setSnapshots(rer)

    }


  }, [list])

  React.useEffect(() => {
    // Предполагая, что есть состояние, которое изменяется в handlerOnClickAdd
    // Например, это может быть состояние, отслеживающее, была ли нажата кнопка

    inputRef.current?.focus();


  }, [isLoader, isLoader2, snapshots]);

  function sub(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAdd(): void {
    if (list) {

      const newElement = createListItem(values.inputValue);
      list.prepend(newElement);

      const test = list.getSnap()

      setSnapshots(test)

    }


/*    setIsLoader(true)

    if (list) {

      createQueneSnaphotsPush(list, values.inputValue)
      values.inputValue = ""
      setSnapshots(list.getHistory());
    }*/

  }


  function handlerOnClickClear(): void {
/*    if (list) {
      createGueueSnaphotsClear(list)
      setSnapshots(list.getHistory());
    }*/

  }


  function handlerOnClickDelete(): void {
/*    setIsLoader2(true)
    if (list) {
      createQueueSnaphotsPop(list)
      setSnapshots(list.getHistory());
    }*/

  }

  const CircleMemo = React.memo(Circle);

  function createHead(elementsList: TNewSnapList<TElementList>, index: number, element: LinkedListNode<TElementList>){

    if (element === elementsList.elementPointer) {
      { return {head: <CircleMemo letter={elementsList.newToAdd?.value.letter} state={ElementStates.Changing} isSmall={true}/>} }
    }



    if (index === 0) { return {head: "head"} }


    return null
  }

  const createContent = (elementsList: TNewSnapList<TElementList>) => {
/*    console.log({"Head":elementsList.head, "Tail":elementsList.tail,"size":elementsList.size,"lenght":elementsList.length,})*/
    return (
      <ul className="container-result list">
        {elementsList.container.map((element, index) =>
          <li key={index}>
            {!element && <CircleMemo state={ElementStates.Default} letter={""} index={index} {...index === 0 && {
              head: "head"
            }}/>}
{/*            {element &&
              <CircleMemo state={element.state} letter={element.letter} index={index} {...index === elementsList.head && {
                head: "head"
              }} {...index === elementsList.tail - 1 && {
                tail: "tail"
              }}/>}*/}
            {element &&
              <CircleMemo
                state={element.value.state}
                letter={element.value.letter}
                index={index}
                {...index === 0  && { head: "head"}}
                {...createHead(elementsList, index, element)}
                {...index === elementsList.container.length - 1 && { tail: "tail"  }}
              />}
          </li>)}
      </ul>
    );
  };

  console.log(snapshots?.length)
  return (
    <>
      <form className="container-inputs-buttons container_type_stack" onSubmit={sub}>
        <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange}
               disabled={isLoader || isLoader2} tabIndex={0}
               value={values.inputValue} name='inputValue'/>
        <Button text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader} disabled={isLoader2 || !values.inputValue}/>
        <Button text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader2}
                disabled={!list?.getSize() || isLoader}/>
        <Button extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                disabled={!list?.getSize() || isLoader || isLoader2}/>
      </form>

      {snapshots &&
        <StepByStepDisplay2<TNewSnapList<TElementList>> steps={snapshots}
                                                      setLoader={isLoader ? setIsLoader : setIsLoader2}
                                                      childComponent={createContent}
                                                      delay={delay}/>}
    </>
  );
};