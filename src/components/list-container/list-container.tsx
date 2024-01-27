import React, {FormEvent, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ILinkedList, LinkedList, TNewSnapList} from "../../utils/linked-list";
import {createListItem, TElementList} from "../../utils/utils";
import {LinkedListNode} from "../../utils/linked-list-node";
import {StepByStepDisplay3} from "../step-by-step-display/step-by-step-display3";
import styles from "./list-container.module.css"
import {randomNumbers} from "../../utils/random-numbers";

type TInputData = {
  inputValue: string;
  inputIndex: string;
}

export const ListContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoader2, setIsLoader2] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapList<TElementList>> | null>(null);
  const [list, setList] = useState<ILinkedList<TElementList> | null>(null);


  const {values, handleChange} = useForm<TInputData>({
    inputValue: "",
    inputIndex: "",
  });

  const delay = DELAY_IN_MS;
  const maxInput = 4
  const maxSizeList = 10
  const minSizeList = 1
  const stepNumber = 1

  function createNode(element: TElementList): LinkedListNode<TElementList> {
    return new LinkedListNode(element);
  }

  React.useEffect(() => {

    const random = randomNumbers({minLen: 1, maxLen: 6, maxValue: 9999})
    const initialDate = random.map((item) => {
      return createNode(createListItem(String(item)))
    })
    const list = new LinkedList<TElementList>(initialDate);
    setList(list)
  }, [])

  React.useEffect(() => {
    if (list) {
      saveSnapshots(list)
    }
  }, [list])


  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function saveSnapshots(list: ILinkedList<TElementList>):void {
    const snapshots = list.getSnap()
    setSnapshots(snapshots)
  }
  function addHead(): void {
    if (list) {
      const newElement = createListItem(values.inputValue);
      list.prepend(newElement);
      saveSnapshots(list)
    }
  }

  function addTail(): void {
    if (list) {
      const newElement = createListItem(values.inputValue);
      list.append(newElement);
      saveSnapshots(list)
    }
  }

  function addByIndex(): void {
    if (list) {
      const newElement = createListItem(values.inputValue);
      const index = Number(values.inputIndex);
      list.addByIndex(newElement, index);
      saveSnapshots(list)
    }
  }

  function deleteHead(): void {
    setIsLoader2(true)
    if (list) {
      list.deleteHead()
      saveSnapshots(list)
    }

  }

  function deleteTail(): void {
    setIsLoader2(true)
    if (list) {
      list.deleteTail()
      saveSnapshots(list)
    }

  }

  function deleteByIndex(): void {
    setIsLoader2(true)
    if (list) {
      const index = Number(values.inputIndex);
      list.deleteByIndex(index)
      saveSnapshots(list)
    }
  }

  const maxIndex = (list && (maxSizeList - 1) > list.getSize() - 1 ) ? list.getSize() - 1: (maxSizeList - 1);
  const isCorrectNumber =  (Number(values.inputIndex) >= 0) && (Number(values.inputIndex) <= maxIndex)
  const isCorrectValue = values.inputValue !== ""
  const isCorrectValueIndex = values.inputValue !== ""

  const isCorrectSize = (list && list.getSize() > 1)
console.log( values.inputIndex + 4)

  return (
    <>
      <form className="container-inputs-buttons container_type_list" onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset}>
          <Input maxLength={maxInput} isLimitText={true} onChange={handleChange}
                 disabled={isLoader || isLoader2} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить в head"} onClick={addHead} isLoader={isLoader}
                  disabled={!isCorrectValue} linkedList={"small"}/>
          <Button text={"Добавить в tail"} onClick={addTail} isLoader={isLoader2}
                  disabled={!isCorrectValue} linkedList={"small"}/>
          <Button text={"Удалить из head"} onClick={deleteHead} isLoader={isLoader}
                  disabled={!isCorrectSize} linkedList={"small"}/>
          <Button text={"Удалить из tail"} onClick={deleteTail} isLoader={isLoader2}
                  disabled={!isCorrectSize} linkedList={"small"}/>

        </fieldset>
        <fieldset className={styles.fieldset2}>
          <Input onChange={handleChange}
                 disabled={isLoader || isLoader2} max={9} min={0}  tabIndex={0} type={"number"}
                 value={values.inputIndex} name='inputIndex'/>
          <Button text={"Добавить по индексу"} onClick={addByIndex} isLoader={isLoader}
                  disabled={!isCorrectNumber || !isCorrectValue} linkedList={"big"}/>
          <Button text={"Удалить по индексу"} onClick={deleteByIndex} linkedList={"big"} isLoader={isLoader2}
                  disabled={!isCorrectNumber || !isCorrectValueIndex || !isCorrectSize}/>

        </fieldset>

      </form>

      {snapshots &&
        <StepByStepDisplay3<TNewSnapList<TElementList>> steps={snapshots}
                                                        setLoader={isLoader ? setIsLoader : setIsLoader2}
                                                        delay={delay}/>}
    </>
  );
};