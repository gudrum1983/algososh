import React, {FormEvent, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./link-list-algoritm-viewer.module.css"
import {randomNumbers} from "../../utils/random-numbers";
import {Buttons} from "../../types/buttons";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {ILinkListState, LinkList, LinkListNode} from "./utils-link-list/link-list";
import {LinkListSnapshotStorage} from "./utils-link-list/link-list-snapshot-storage";

type TInputData = {
  inputValue: string;
  inputIndex: string;
}

export const LinkListAlgoritmViewer: React.FC = () => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [linkListSnapshotStorage, setLinkListSnapshotStorage] = useState<LinkListSnapshotStorage<string> | null>(null);
  const [linkList, setLinkList] = useState<LinkList<string> | null>(null);
  const [linkListState, setLinkListState] = useState<ILinkListState<string> | null>(null);

  const initialInputValue: TInputData = {inputValue: "", inputIndex: ""}

  const {values, handleChange, setValues} = useForm<TInputData>(initialInputValue);

  const delay = DELAY_IN_MS;
  const maxInput = 4;
  const maxSizeList = 10;
  const maxSizeInitialList = 6;
  const minSizeList = 1;
  const maxIndex = (linkList && (maxSizeList - 1) > linkList.getSize() - 1) ? linkList.getSize() - 1 : (maxSizeList - 1);
  const isCorrectNumber = (Number(values.inputIndex) >= 0) && (Number(values.inputIndex) <= maxIndex)
  const isCorrectValue = values.inputValue !== ""
  const isCorrectValueIndex = values.inputIndex !== ""
  const isCorrectSize = (linkList && linkList.getSize() > 1)

  function applySnapshotToLinkListState(snapshotStorage : LinkListSnapshotStorage<string>): void {
    const snapshot = snapshotStorage && snapshotStorage.retrieveAndRemoveSnapshot();
    const state = snapshot && snapshot.getState();
    state && setLinkListState(state);
  }

  React.useEffect(() => {
    const random = randomNumbers({minLen: minSizeList, maxLen: maxSizeInitialList, maxValue: 9999})
    const initialDate = random.map((item) => {
      return (String(item))
    })
    const newLinkList = new LinkList<string>(initialDate);
    const newLinkListSnapshotStorage = new LinkListSnapshotStorage(newLinkList)

    const backup = () => (newLinkListSnapshotStorage && newLinkListSnapshotStorage.createAndStoreSnapshot());
    newLinkList && newLinkList.setBackup(backup);
    setLinkList(newLinkList);
    setLinkListSnapshotStorage(newLinkListSnapshotStorage);
    newLinkListSnapshotStorage.createAndStoreSnapshot();
    applySnapshotToLinkListState(newLinkListSnapshotStorage);
  }, [])

  React.useEffect(() => {
    let stepsTimeoutId: NodeJS.Timeout;
    if (linkListSnapshotStorage) {
      if (!(linkListSnapshotStorage.isEmpty())) {
        stepsTimeoutId = setTimeout(() => {
          applySnapshotToLinkListState(linkListSnapshotStorage)
        }, delay);
      } else {
        setIsLoader(null);
        linkListSnapshotStorage.clear();
      }
    }
    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [linkListState, delay, linkListSnapshotStorage]);

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault()
  }

  function addHead(): void {
    setIsLoader(Buttons.addHead)
    if (linkList && linkListSnapshotStorage) {
      linkList.prepend(values.inputValue);
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function addTail(): void {
    setIsLoader(Buttons.addTail)
    if (linkList && linkListSnapshotStorage) {
      linkList.append(values.inputValue);
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function addByIndex(): void {
    setIsLoader(Buttons.addByIndex)
    if (linkList && linkListSnapshotStorage) {
      linkList.addByIndex(values.inputValue, Number(values.inputIndex));
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function deleteByIndex(): void {
    setIsLoader(Buttons.deleteByIndex)
    if (linkList && linkListSnapshotStorage) {
      linkList.deleteByIndex(Number(values.inputIndex));
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function deleteHead(): void {
    setIsLoader(Buttons.deleteHead)
    if (linkList && linkListSnapshotStorage) {
      linkList.deleteHead()
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function deleteTail(): void {
    setIsLoader(Buttons.deleteTail)
    if (linkList && linkListSnapshotStorage) {
      linkList.deleteTail()
      applySnapshotToLinkListState(linkListSnapshotStorage);
      setValues(initialInputValue);
    }
  }


  const CircleMemo = React.memo(Circle);
  const ButtonMemo = React.memo(Button);

  function getElementHead(state: ILinkListState<string>, index: number, element: LinkListNode<string>) {
    let headProp = null;
    if (element === state.activeElement && state.indicatorToAdd) {
      headProp = {
        head:
          <CircleMemo letter={state.indicatorToAdd?.letter} state={ElementStates.Changing} isSmall={true}/>
      };
    } else if (index === 0) {
      headProp = {head: "head"};
    }
    return headProp;
  }

  function getElementState(state: ILinkListState<string>, element: LinkListNode<string>) {
    let stateProp = null;
    if (state.sectionBeforeActiveElement && element.id in state.sectionBeforeActiveElement) {
      stateProp = {state: ElementStates.Changing};
    } else if (state.newElement === element) {
      stateProp = {state: ElementStates.Modified};
    }
    return stateProp;
  }

  function getElementTail(state: ILinkListState<string>, index: number, element: LinkListNode<string>) {
    let tailProp = null;
    if (element === state.indicatorToRemove) {
      tailProp = {
        tail:
          <CircleMemo letter={state.indicatorToRemove?.letter} state={ElementStates.Changing} isSmall={true}/>
      };
    } else if (index === state.container.length - 1) {
      tailProp = {tail: "tail"}
    }
    return tailProp
  }


  return (
    <>
      <form className={styles.formList} onSubmit={disableFormSubmission}>
        <fieldset data-cy="fieldset-value" className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input data-cy="input-value" maxLength={maxInput} isLimitText={true} onChange={handleChange}
                 value={values.inputValue} name='inputValue'/>
          <ButtonMemo  data-cy="button-add-head" text={"Добавить в head"} onClick={addHead} isLoader={isLoader === Buttons.addHead}
                  disabled={!isCorrectValue} linkedList={"small"} name={Buttons.addHead}/>
          <ButtonMemo data-cy="button-add-tail" text={"Добавить в tail"} onClick={addTail} isLoader={isLoader === Buttons.addTail}
                  disabled={!isCorrectValue} linkedList={"small"} name={Buttons.addTail}/>
          <ButtonMemo text={"Удалить из head"} onClick={deleteHead} isLoader={isLoader === Buttons.deleteHead}
                  disabled={!isCorrectSize} linkedList={"small"} name={Buttons.deleteHead}/>
          <ButtonMemo text={"Удалить из tail"} onClick={deleteTail} isLoader={isLoader === Buttons.deleteTail}
                  disabled={!isCorrectSize} linkedList={"small"} name={Buttons.deleteTail}/>
        </fieldset>
        <fieldset data-cy="fieldset-index" className={styles.fieldset2} disabled={Boolean(isLoader)}>
          <Input data-cy="input-index" onChange={handleChange} max={9} min={0} type={"number"}
                 value={values.inputIndex} name='inputIndex'/>
          <ButtonMemo data-cy="button-add-by-index" text={"Добавить по индексу"} onClick={addByIndex} isLoader={isLoader === Buttons.addByIndex}
                  disabled={!isCorrectNumber || !isCorrectValue} linkedList={"big"} name={Buttons.addByIndex}/>
          <ButtonMemo data-cy="button-delete-by-index" text={"Удалить по индексу"} onClick={deleteByIndex} linkedList={"big"}
                  isLoader={isLoader === Buttons.deleteByIndex}
                  disabled={!isCorrectNumber || !isCorrectValueIndex || !isCorrectSize} name={Buttons.deleteByIndex}/>
        </fieldset>
      </form>

      {linkListSnapshotStorage &&
        <ul className={styles.containerResultList}>
          {linkListState && linkListState.container.map((element, index) =>
            <li key={element ? element.id : index}>
              <div className={styles.element}>
                {element && <CircleMemo
                  {...getElementState(linkListState, element)}
                  letter={linkListState.removeElement === element ? "" : element.letter}
                  index={index}
                  {...getElementHead(linkListState, index, element)}
                  {...getElementTail(linkListState, index, element)}
                />}
                {element && linkListState.tail !== element && <div className={styles.arrows}/>}
              </div>
            </li>
          )}
        </ul>}
    </>
  );
};