import React, {FormEvent, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ILinkedList, LinkedList, TNewSnapList} from "../../utils/linked-list";
import {Buttons, createListItem, TElementList} from "../../utils/utils";
import {LinkedListNode} from "../../utils/linked-list-node";
import {StepByStepDisplay3} from "../step-by-step-display/step-by-step-display3";
import styles from "./list-container.module.css"
import {randomNumbers} from "../../utils/random-numbers";
import {initialState} from "../../algorithms/create-queue-snaphots/create-gueue-snaphots";

type TInputData = {
  inputValue: string;
  inputIndex: string;
}

export const ListContainer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<false | Buttons>(false);
  const [snapshots, setSnapshots] = useState<Array<TNewSnapList<TElementList>> | null>(null);
  const [list, setList] = useState<ILinkedList<TElementList> | null>(null);

  const initialStateValue:TInputData = {inputValue: "", inputIndex: ""}



  const {values, handleChange, setValues} = useForm<TInputData>(initialStateValue);

  const delay = DELAY_IN_MS;
  const maxInput = 4
  const maxSizeList = 10
  const maxSizeInitialList = 6
  const minSizeList = 1
  const maxIndex = (list && (maxSizeList - 1) > list.getSize() - 1) ? list.getSize() - 1 : (maxSizeList - 1);
  const isCorrectNumber = (Number(values.inputIndex) >= 0) && (Number(values.inputIndex) <= maxIndex)
  const isCorrectValue = values.inputValue !== ""
  const isCorrectValueIndex = values.inputIndex !== ""
  const isCorrectSize = (list && list.getSize() > 1)

  function createNode(element: TElementList): LinkedListNode<TElementList> {
    return new LinkedListNode(element);
  }

  React.useEffect(() => {
    const random = randomNumbers({minLen: minSizeList, maxLen: maxSizeInitialList, maxValue: 9999})
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

  function saveSnapshots(list: ILinkedList<TElementList>): void {
    const snapshots = list.getSnapshots()
    setSnapshots(snapshots)
  }

  function addHead(): void {
    setIsLoader(Buttons.addHead)
    const newElement = createListItem(values.inputValue);
    setValues(initialStateValue)
    if (list) {
      list.prepend(newElement);
      saveSnapshots(list)
    }
  }

  function addTail(): void {
    setIsLoader(Buttons.addTail)
    const newElement = createListItem(values.inputValue);
    setValues(initialStateValue)
    if (list) {
      list.append(newElement);
      saveSnapshots(list)
    }
  }

  function addByIndex(): void {
    setIsLoader(Buttons.addByIndex)
    const newElement = createListItem(values.inputValue);
    setValues(initialStateValue)
    if (list) {
      const index = Number(values.inputIndex);
      list.addByIndex(newElement, index);
      saveSnapshots(list)
    }
  }

  function deleteByIndex(): void {
    setIsLoader(Buttons.deleteByIndex)
    const index = Number(values.inputIndex);
    setValues(initialStateValue)
    if (list) {
      list.deleteByIndex(index)
      saveSnapshots(list)
    }
  }

  function deleteHead(): void {
    setIsLoader(Buttons.deleteHead)
    if (list) {
      list.deleteHead()
      saveSnapshots(list)
    }
  }

  function deleteTail(): void {
    setIsLoader(Buttons.deleteTail)
    if (list) {
      list.deleteTail()
      saveSnapshots(list)
    }
  }

  return (
    <>
      <form className="container-inputs-buttons container_type_list" onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input maxLength={maxInput} isLimitText={true} onChange={handleChange}
                 value={values.inputValue} name='inputValue'/>
          <Button text={"Добавить в head"} onClick={addHead} isLoader={isLoader === Buttons.addHead}
                  disabled={!isCorrectValue} linkedList={"small"} name={Buttons.addHead}/>
          <Button text={"Добавить в tail"} onClick={addTail} isLoader={isLoader === Buttons.addTail}
                  disabled={!isCorrectValue} linkedList={"small"} name={Buttons.addTail}/>
          <Button text={"Удалить из head"} onClick={deleteHead} isLoader={isLoader === Buttons.deleteHead}
                  disabled={!isCorrectSize} linkedList={"small"} name={Buttons.deleteHead}/>
          <Button text={"Удалить из tail"} onClick={deleteTail} isLoader={isLoader === Buttons.deleteTail}
                  disabled={!isCorrectSize} linkedList={"small"} name={Buttons.deleteTail}/>
        </fieldset>
        <fieldset className={styles.fieldset2} disabled={Boolean(isLoader)}>
          <Input onChange={handleChange} max={9} min={0} type={"number"}
                 value={values.inputIndex} name='inputIndex'/>
          <Button text={"Добавить по индексу"} onClick={addByIndex} isLoader={isLoader === Buttons.addByIndex}
                  disabled={!isCorrectNumber || !isCorrectValue} linkedList={"big"} name={Buttons.addByIndex}/>
          <Button text={"Удалить по индексу"} onClick={deleteByIndex} linkedList={"big"}
                  isLoader={isLoader === Buttons.deleteByIndex}
                  disabled={!isCorrectNumber || !isCorrectValueIndex || !isCorrectSize} name={Buttons.deleteByIndex}/>
        </fieldset>
      </form>

      {snapshots &&
        <StepByStepDisplay3<TNewSnapList<TElementList>> steps={snapshots}
                                                        setLoader={setIsLoader}
                                                        delay={delay}/>}
    </>
  );
};