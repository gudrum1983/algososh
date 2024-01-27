import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ILinkedList, LinkedList, TNewSnapList} from "../../utils/linked-list";
import {createListItem, TElementList} from "../../utils/utils";
import {LinkedListNode} from "../../utils/linked-list-node";
import {StepByStepDisplay3} from "../step-by-step-display/step-by-step-display3";
import styles from "./list-container.module.css"

type TFormData = {
  inputValue: string;
  inputIndex: string;
}

export const ListContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoader2, setIsLoader2] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapList<TElementList>> | null>(null);
  const [list, setList] = useState<ILinkedList<TElementList> | null>(null);


  const {values, handleChange} = useForm<TFormData>({
    inputValue: "",
    inputIndex: "",
  });

  const delay = DELAY_IN_MS;
  const max = 4

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

    const list = new LinkedList<TElementList>(initialDate);

    setList(list)
  }, [])

  React.useEffect(() => {
    if (list) {
      const rer = list.getSnap()
      setSnapshots(rer)
    }
  }, [list])


  function sub(e: FormEvent): void {
    e.preventDefault()
  }

  function handlerOnClickAddHead(): void {
    if (list) {
      setIsLoader(true)
      const newElement = createListItem(values.inputValue);
      list.prepend(newElement);
      const test = list.getSnap()
      setSnapshots(test)
    }
  }

  function handlerOnClickAddTail(): void {
    if (list) {
      setIsLoader(true)
      const newElement = createListItem(values.inputValue);
      list.append(newElement);
      const test = list.getSnap()
      setSnapshots(test)
    }
  }

  function handlerOnClickAddByIndex(): void {


    if (list) {
      setIsLoader(true)
      const newElement = createListItem(values.inputValue);
      const index = Number(values.inputIndex);

      list.addByIndex(newElement, index);
      const test = list.getSnap()
      setSnapshots(test)
    }
  }

  function handlerOnClickDeleteHead(): void {
    setIsLoader2(true)
    if (list) {
      list.deleteHead()
      const test = list.getSnap()
      setSnapshots(test)
    }

  }

  function handlerOnClickDeleteTail(): void {
    setIsLoader2(true)
    if (list) {
      list.deleteTail()
      const test = list.getSnap()
      setSnapshots(test)
    }

  }

  function handlerOnClickDeleteByIndex(): void {
    setIsLoader2(true)
    if (list) {
      const index = Number(values.inputIndex);
      list.deleteByIndex(index)

      const test = list.getSnap()
      test.forEach((item) => {
        console.log(item.sectionPointer)
      })
     if(test){ setSnapshots(test)}
    }
  }

  return (
    <>
      <form className="container-inputs-buttons container_type_list" onSubmit={sub}>
        <fieldset className={styles.fieldset}>
          <Input maxLength={max} isLimitText={true} onChange={handleChange}
                 disabled={isLoader || isLoader2} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить в head"} onClick={handlerOnClickAddHead} isLoader={isLoader}
                  disabled={isLoader2 || !values.inputValue} linkedList={"small"}/>
          <Button text={"Добавить в tail"} onClick={handlerOnClickAddTail} isLoader={isLoader2}
                  disabled={!list?.getSize() || isLoader} linkedList={"small"}/>
          <Button text={"Удалить из head"} onClick={handlerOnClickDeleteHead} isLoader={isLoader}
                  disabled={isLoader2 || !values.inputValue} linkedList={"small"}/>
          <Button text={"Удалить из tail"} onClick={handlerOnClickDeleteTail} isLoader={isLoader2}
                  disabled={!list?.getSize() || isLoader} linkedList={"small"}/>

        </fieldset>
        <fieldset className={styles.fieldset2}>
          <Input onChange={handleChange}
                 disabled={isLoader || isLoader2} tabIndex={0} type={"number"}
                 value={values.inputIndex} name='inputIndex'/>
          <Button text={"Добавить по индексу"} onClick={handlerOnClickAddByIndex} isLoader={isLoader}
                  disabled={isLoader2 || !values.inputValue} linkedList={"big"}/>
          <Button text={"Удалить по индексу"} onClick={handlerOnClickDeleteByIndex} linkedList={"big"} isLoader={isLoader2}
                  disabled={!list?.getSize() || isLoader}/>

        </fieldset>

      </form>

      {snapshots &&
        <StepByStepDisplay3<TNewSnapList<TElementList>> steps={snapshots}
                                                        setLoader={isLoader ? setIsLoader : setIsLoader2}
                                                        delay={delay}/>}
    </>
  );
};