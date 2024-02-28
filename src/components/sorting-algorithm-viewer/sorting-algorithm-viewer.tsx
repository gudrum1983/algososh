import {Button} from "../ui/button/button";
import React, {FormEvent, useRef, useState} from "react";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {ColumnBaseElement} from "../../types/base-element";
import useForm from "../../useForm";
import styles from "./sorting-algorithm-viewer.module.css";
import {RadioInput} from "../ui/radio-input/radio-input";
import {BUBBLE, SELECTION, TSortingMethod} from "../../types/sorting-method";
import {Direction} from "../../types/direction";
import {randomNumbers} from "../../utils/random-numbers";
import {createBubbleSortingSnapshots, createSelectionSortingSnapshots} from "./utils";
import {ElementStates} from "../../types/element-states";
import {VisualStateSorting} from "./visual-state-sorting/visual-state-sorting";
import {Buttons} from "../../types/buttons";
import {IColumnComponent} from "../../utils/column";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";
import {createDefaultColumnElements2} from "../../utils/utils";

import {TStateAndSnapshotStorage} from "../../utils/memento";


type TFormData = { inputValue: string; typeSort: string };
export type TElementSorting = Pick<ColumnBaseElement, "index" | "state" | "id">
export type TSnapshotSorting = { containerSorting: Array<TElementSorting> };

export const SortingAlgorithmViewer = () => {

  const [initialElements, setInitialElements] = useState<Array<IColumnComponent> | null>(null);
  const [isLoader, setIsLoader] = useState<Buttons | null>(null);

  const inputInitialState = {inputValue: "", typeSort: SELECTION};
  const {values, handleChange} = useForm<TFormData>(inputInitialState);

  const stateAndSnapshotsForVisualization = useRef<TStateAndSnapshotStorage<IColumnComponent> | null>(null);

  const delay = SHORT_DELAY_IN_MS;

  function createNewElements() {
    const newArr = randomNumbers();
    const elements = createDefaultColumnElements2(newArr);
    setInitialElements(elements);
  }

  React.useEffect(() => {
    createNewElements();
  }, []);

  function handlerOnClickNewRandomValue(): void {
    stateAndSnapshotsForVisualization.current = null;
    createNewElements();
  }

  function handlerOnClickDescending(): void {
    setIsLoader(Buttons.sortDescending);
    startSortingProcess(values.typeSort, Direction.Descending);
  }

  function handlerOnClickAscending(): void {
    setIsLoader(Buttons.sortAscending);
    startSortingProcess(values.typeSort, Direction.Ascending);
  }

  function startSortingProcess(type: TSortingMethod, direction: Direction) {
    if (!initialElements) {
      return;
    }
    if (type === SELECTION) {
      stateAndSnapshotsForVisualization.current = createSelectionSortingSnapshots(initialElements, direction);
    }
    if (type === BUBBLE) {
      stateAndSnapshotsForVisualization.current = createBubbleSortingSnapshots(initialElements, direction);
    }
    const defaultStateElements = stateAndSnapshotsForVisualization.current?.state.getState().map(el => ({
      ...el,
      state: ElementStates.Default,
    }));
    defaultStateElements && setInitialElements(defaultStateElements);
  }

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault();
  }

  const state = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.state;
  const snapshotStorage = stateAndSnapshotsForVisualization.current && stateAndSnapshotsForVisualization.current.snapshotStorage;

  const ButtonMemo = React.memo(Button);

  return (
    <>
      <form onSubmit={disableFormSubmission}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <fieldset className={styles.radioFieldset}>
            <RadioInput extraClass={"m-0 mr-20"} onChange={handleChange} value={SELECTION}
                        label={"Выбор"}
                        defaultChecked name={"typeSort"}/>
            <RadioInput extraClass="mr-20" onChange={handleChange} value={BUBBLE} label={"Пузырёк"}
                        name={"typeSort"}/>
          </fieldset>
          <ButtonMemo sorting={Direction.Ascending} linkedList={"medium"} onClick={handlerOnClickAscending}
                      text={"По возрастанию"} name={Buttons.sortAscending}
                      isLoader={isLoader === Buttons.sortAscending}/>
          <ButtonMemo sorting={Direction.Descending} linkedList={"medium"} onClick={handlerOnClickDescending}
                      text={"По убыванию"} name={Buttons.sortDescending}
                      isLoader={isLoader === Buttons.sortDescending}/>
          <ButtonMemo extraClass="ml-auto" linkedList={"medium"} onClick={handlerOnClickNewRandomValue}
                      text={"Новый массив"}/>
        </fieldset>
      </form>
      {initialElements && !snapshotStorage && <VisualStateSorting state={initialElements}/>}
      {state && snapshotStorage &&
        <StepByStepDisplay<IColumnComponent> state={state} snapshotStorage={snapshotStorage}
                                             setLoader={setIsLoader} delay={delay}/>}
    </>
  );
};