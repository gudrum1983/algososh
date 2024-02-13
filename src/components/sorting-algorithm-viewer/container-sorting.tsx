import {Button} from "../ui/button/button";
import React, {FormEvent, useState} from "react";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {ColumnBaseElement} from "../../types/base-element";
import useForm from "../../useForm";
import styles from "./container-sorting.module.css";
import {RadioInput} from "../ui/radio-input/radio-input";
import {BUBBLE, SELECTION, TSortingMethod} from "../../types/sorting-method";
import {Direction} from "../../types/direction";
import {randomNumbers} from "../../utils/random-numbers";
import {createSelectSortingSnapshots} from "./create-select-sorting-snapshots/create-select-sorting-snapshots";
import {createBubbleSortingSnapshots} from "./create-bubble-sorting-snapshots/create-bubble-sorting-snapshots";
import {ElementStates} from "../../types/element-states";
import {VisualContentSorting} from "./visual-content-sorting/visual-content-sorting";
import {Buttons} from "../../types/buttons";
import {IColumnComponent} from "../../utils/column";
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";
import { createDefaultColumnElements2} from "../../utils/utils";

type TFormData = { inputValue: string; typeSort: string };
export type TElementSorting = Pick<ColumnBaseElement, "index" | "state" | "id">
export type TSnapshotSorting = { containerSorting: Array<TElementSorting> };

export const ContainerSorting = () => {

  const [initialElements, setInitialElements] = useState<Array<IColumnComponent> | null>(null);
  const [isLoader, setIsLoader] = useState<Buttons | null>(null);
  const [snapshots, setSnapshots] = useState<Array<Array<IColumnComponent>> | null>(null);

  const inputInitialState = {inputValue: "", typeSort: SELECTION};
  const {values, handleChange} = useForm<TFormData>(inputInitialState);

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
    setSnapshots(null);
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

    let sortingSnapshots: Array<Array<IColumnComponent>> = [initialElements];

    if (type === SELECTION) {
      sortingSnapshots = createSelectSortingSnapshots(initialElements, direction);

    }

    if (type === BUBBLE) {
      sortingSnapshots = createBubbleSortingSnapshots(initialElements, direction);
    }

    setSnapshots(sortingSnapshots);

    const defaultStateElements = sortingSnapshots[sortingSnapshots.length - 1].map(el => ({
      ...el,
      state: ElementStates.Default,
    }))

    setInitialElements(defaultStateElements);
  }

  function disableFormSubmission(e: FormEvent): void {
    e.preventDefault();
  }

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
          <Button sorting={Direction.Ascending} linkedList={"medium"} onClick={handlerOnClickAscending}
                  text={"По возрастанию"} name={Buttons.sortAscending}
                  isLoader={isLoader === Buttons.sortAscending}/>
          <Button sorting={Direction.Descending} linkedList={"medium"} onClick={handlerOnClickDescending}
                  text={"По убыванию"} name={Buttons.sortDescending}
                  isLoader={isLoader === Buttons.sortDescending}/>
          <Button extraClass="ml-auto" linkedList={"medium"} onClick={handlerOnClickNewRandomValue}
                  text={"Новый массив"}/>
        </fieldset>
      </form>
      {initialElements && !snapshots && <VisualContentSorting content={initialElements}/>}
      {snapshots &&
        <StepByStepDisplay<IColumnComponent> steps={snapshots} setLoader={setIsLoader} delay={delay}/>}
    </>
  );
};