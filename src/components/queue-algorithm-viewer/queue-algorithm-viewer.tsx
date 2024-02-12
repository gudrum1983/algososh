import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./queue-algorithm-viewer.module.css";
import {Buttons} from "../../types/buttons";
import {IQueueState, Queue, QueueSnapshotStorage} from "./utils";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";

type TFormData = { inputValue: string };

export const QueueAlgorithmViewer = ():JSX.Element => {

  const [isLoader, setIsLoader] = useState<null | Buttons>(null);
  const [queueSnapshotStorage, setQueueSnapshotStorage] = useState<QueueSnapshotStorage<string> | null>(null);
  const [queue, setQueue] = useState<Queue<string> | null>(null);
  const [queueState, setQueueState] = useState<IQueueState<string> | null>(null);

  const initialInputValue = {inputValue: ""};

  const {values, handleChange, setValues} = useForm<TFormData>(initialInputValue);

  const delay = DELAY_IN_MS;
  const max = 4;

  const inputRef = useRef<HTMLInputElement>(null);

  function applySnapshotToQueueState(snapshotStorage : QueueSnapshotStorage<string>): void {
    const snapshot = snapshotStorage && snapshotStorage.retrieveAndRemoveSnapshot();
    const state = snapshot && snapshot.getState();
    state && setQueueState(state);
  }


  React.useEffect(() => {
    const newQueue = new Queue<string>(7);
    const newQueueSnapshotStorage = new QueueSnapshotStorage(newQueue);
    const backup = () => (newQueueSnapshotStorage && newQueueSnapshotStorage.createAndStoreSnapshot());
    newQueue && newQueue.setBackup(backup);
    setQueue(newQueue);
    setQueueSnapshotStorage(newQueueSnapshotStorage);
    newQueueSnapshotStorage.createAndStoreSnapshot();
    applySnapshotToQueueState(newQueueSnapshotStorage);
  }, []);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader, queueSnapshotStorage]);

  React.useEffect(() => {
    let stepsTimeoutId: NodeJS.Timeout;
    if (queueSnapshotStorage) {
      if (!(queueSnapshotStorage.isEmpty())) {
        stepsTimeoutId = setTimeout(() => {
          applySnapshotToQueueState(queueSnapshotStorage)
        }, delay);
      } else {
        setIsLoader(null);
        queueSnapshotStorage.clear();
      }
    }
    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [queueState, delay, queueSnapshotStorage]);

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault();
  }

  function handlerOnClickAdd(): void {
    setIsLoader(Buttons.addTail);
    if (queue && queueSnapshotStorage) {
      queue.enqueue(values.inputValue);
      applySnapshotToQueueState(queueSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function handlerOnClickClear(): void {
    setIsLoader(Buttons.clear);
    if (queueSnapshotStorage && queue?.checkCanClear()) {
      queue.clear();
      applySnapshotToQueueState(queueSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  function handlerOnClickDelete(): void {
    setIsLoader(Buttons.deleteHead);
    if (queue && queueSnapshotStorage) {
      const queueLength = queue.getLength();
      if (queueLength <= 0) {
        return
      }
      queue.dequeue();
      applySnapshotToQueueState(queueSnapshotStorage);
      setValues(initialInputValue);
    }
  }

  const CircleMemo = React.memo(Circle);
  const ButtonMemo = React.memo(Button);

  return (
    <>
      <form className={styles.formQueue} onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={max} isLimitText={true} onChange={handleChange} tabIndex={0}
                 value={values.inputValue} name='inputValue'/>
          <ButtonMemo text={"Добавить"} onClick={handlerOnClickAdd} isLoader={isLoader === Buttons.addTail}
                  name={Buttons.addTail}
                  disabled={!values.inputValue || queue?.checkCanAdd()}/>
          <ButtonMemo text={"Удалить"} onClick={handlerOnClickDelete} isLoader={isLoader === Buttons.deleteHead}
                  name={Buttons.deleteHead}
                  disabled={!queue?.checkCanDelete()}/>
          <ButtonMemo extraClass={"ml-40"} text={"Очистить"} onClick={handlerOnClickClear}
                  isLoader={isLoader === Buttons.clear} name={Buttons.clear}
                  disabled={!queue?.checkCanClear()}/>
        </fieldset>
      </form>
      {queueState &&
        <ul className={styles.containerResultQueue}>
          {queueState.container && queueState.container.map((element, index) =>
            <li key={index}>
              <CircleMemo index={index}
                          {...(element && {letter: String(element)})}
                          {...(index === queueState.activeIndex) && {state: ElementStates.Changing}}
                          {...(index === queueState.tailIndex) && {tail: "tail"}}
                          {...(index === queueState.headIndex) && {head: "head"}}
              />
            </li>
          )}
        </ul>}
    </>
  );
};