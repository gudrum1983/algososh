import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Button} from "../../components/ui/button/button";
import {RadioInput} from "../../components/ui/radio-input/radio-input";
import {Column} from "../../components/ui/column/column";
import {Direction} from "../../types/direction";
import {randomNumbers} from "../../utils/random-numbers";
import {createBubbleSortingSnapshots} from "../../algorithms/create-bubble-sorting-snapshots/create-bubble-sorting-snapshots";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {copyAndResetElementStates, createInitElements} from "../../utils/utils";
import {createSelectSortingSnapshots} from "../../algorithms/create-select-sorting-snapshots/create-select-sorting-snapshots";
import {ColumnBaseElement, TSnapshot, TSnapshotsList} from "../../types/element-and-snapshot";
import {BUBBLE, SELECTION, TSortingMethod} from "../../types/sorting-method";

export type TElementColumn = Pick<ColumnBaseElement, "index" | "state" | "id">

export const SortingPage: React.FC = () => {

  const [initialValue, setInitialValue] = useState<TSnapshot<TElementColumn> | null>(null);
  const [isLoaderSortDescending, setIsLoaderSortDescending] = useState<boolean>(false);
  const [isLoaderSortAscending, setIsLoaderSortAscending] = useState<boolean>(false);
  const [typeSort, setTypeSort] = useState<TSortingMethod>(SELECTION);
  const [snapshots, setSnapshots] = useState<TSnapshotsList<TElementColumn> | null>(null);


  React.useEffect(() => {
    const newArr = randomNumbers();
    const elements = createInitElements(newArr);
    setInitialValue(elements);
  }, []);

  function handlerOnClickNewRandomValue(): void {
    setSnapshots(null);
    const newArr = randomNumbers();
    const test = createInitElements(newArr);
    setInitialValue(test);
  }

  function handlerOnClickDescending(): void {
    setIsLoaderSortDescending(true);
    startSortingProcess(typeSort, Direction.Descending);
  }

  function handlerOnClickAscending(): void {
    setIsLoaderSortAscending(true);
    startSortingProcess(typeSort, Direction.Ascending);
  }

  function startSortingProcess(type: TSortingMethod, direction: Direction) {
    if (!initialValue) {
      return;
    }

    let sortingSnapshots:TSnapshotsList<TElementColumn> = [initialValue];

    if (type === SELECTION) {
      sortingSnapshots = createSelectSortingSnapshots(initialValue, direction);
    }

    if (type === BUBBLE) {
      sortingSnapshots = createBubbleSortingSnapshots(initialValue, direction);
    }

    setSnapshots(sortingSnapshots);
    setInitialValue(copyAndResetElementStates(sortingSnapshots[sortingSnapshots.length - 1]));
  }

  function handlerOnChangeRadio(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === BUBBLE) {
      setTypeSort(BUBBLE);
    } else {
      setTypeSort(SELECTION);
    }
  }

  const ColumnMemo = React.memo(Column);

  const createContent = (elementsList: TSnapshot<TElementColumn>) => {
    return (
      <ul className="container-result container-result-type-sort list">
        {elementsList.map((element) =>
          <li key={element.id}>
            <ColumnMemo state={element.state} index={element.index}/>
          </li>
        )}
      </ul>
    );
  };


  return (
    <SolutionLayout title="Сортировка массива">
      <div role="form" className="container-inputs-buttons container_type_sort">
        <ul className={"list list-row"}>
          <li><RadioInput extraClass={"m-0 mr-20"} onChange={handlerOnChangeRadio} value={SELECTION} label={"Выбор"}
                          defaultChecked name={"typeSort"}
                          disabled={isLoaderSortDescending || isLoaderSortAscending}/></li>
          <li><RadioInput extraClass="mr-20" onChange={handlerOnChangeRadio} value={BUBBLE} label={"Пузырёк"}
                          name={"typeSort"}
                          disabled={isLoaderSortDescending || isLoaderSortAscending}/></li>
        </ul>

        <ul className={"list list-row-butt"}>
          <li><Button sorting={Direction.Ascending} linkedList={"medium"} onClick={handlerOnClickAscending}
                      text={"По возрастанию"} isLoader={isLoaderSortAscending}
                      disabled={isLoaderSortDescending}/>
          </li>
          <li>
            <Button sorting={Direction.Descending} linkedList={"medium"} onClick={handlerOnClickDescending}
                    text={"По убыванию"} isLoader={isLoaderSortDescending}
                    disabled={isLoaderSortAscending}/>
          </li>
        </ul>

        <Button extraClass="ml-auto" linkedList={"medium"} onClick={handlerOnClickNewRandomValue}
                text={"Новый массив"} disabled={isLoaderSortDescending || isLoaderSortAscending}/>
      </div>
      {initialValue && !snapshots && createContent(initialValue)}
      {snapshots &&
        <StepByStepDisplay<TElementColumn> steps={snapshots}
                                    setLoader={isLoaderSortDescending ? setIsLoaderSortDescending : setIsLoaderSortAscending}
                                    childComponent={createContent} delay={500}/>}
    </SolutionLayout>
  )
};