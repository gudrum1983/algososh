import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Button} from "../../components/ui/button/button";
import {RadioInput} from "../../components/ui/radio-input/radio-input";
import {Column} from "../../components/ui/column/column";
import {ElementStates} from "../../types/element-states";
import {Direction} from "../../types/direction";
import {randomArr} from "../../utils/random-arr";

export enum Sort {
  bubble = "bubble",
  selection = "selection"
}

export enum RouteSort {
  "Descending" = 0,
  "Ascending" = 1
}

export type TColumn = {
  index: number,
  state: ElementStates,
  id: string
}


export const SortingPage: React.FC = () => {

  const [initialValue, setInitialValue] = useState<Array<number>>([25, 10, 50, 100])
  const [isLoaderSortDescending, setIsLoaderSortDescending] = useState<boolean>(false)
  const [isLoaderSortAscending, setIsLoaderSortAscending] = useState<boolean>(false)
  const [typeSort, setTypeSort] = useState<string>(Sort.selection)
  const [isCanSortAscending, setIsCanSortAscending] = useState<boolean>(false)
  const [isCanSortDescending, setIsCanSortDescending] = useState<boolean>(false)
  const [snapshots, setSnapshots] = useState<Array<Array<TColumn>> | null>(null)

  function handlerOnClickDescending(): void {
    setIsLoaderSortDescending(true)
    startSort(typeSort, RouteSort.Descending)
    /*      const snapshotsList = generateReversedStringSnapshots(initialValue)

        setSnapshots(snapshotsList)*/
  }

  function handlerOnClickAscending(): void {
    setIsLoaderSortAscending(true)
    startSort(typeSort, RouteSort.Ascending)

    /*    const snapshotsList = generateReversedStringSnapshots(initialValue)*/

    /*    setSnapshots(snapshotsList)*/
  }

  function handlerOnClickNewRandomValue(): void {
    const newArr = randomArr({})
    console.log("NewArray")
    console.log(newArr)
    setInitialValue(newArr)
  }

  function startSort(type: string, route: RouteSort) {
    console.log(`Запуск сортировки тип ${type} направление ${route}`)
  }

  /*
    createBubbleSortSnapshot
    createSelectionSortSnapshot
  */

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {

    console.log(e.target.value)
    setTypeSort(e.target.value)
  }

  const ColumnMemo = React.memo(Column);

  const content = (elementsList: Array<TColumn>) => {
    return (
      <ul className="container-result list">
        {elementsList.map((element) => <li key={element.id}><ColumnMemo state={element.state} index={element.index}/>
        </li>)}
      </ul>
    );
  }


  return (
    <SolutionLayout title="Сортировка массива">
      <div role="form" className="container-inputs-buttons container_type_sort">
        <ul className={"list list-row"}>
          <li><RadioInput extraClass={"m-0 mr-20"} onChange={handlerOnChange} value={Sort.selection} label={"Выбор"}
                          defaultChecked name={"typeSort"}
                          disabled={isLoaderSortDescending || isLoaderSortAscending}/></li>
          <li><RadioInput extraClass="mr-20" onChange={handlerOnChange} value={Sort.bubble} label={"Пузырёк"}
                          name={"typeSort"}
                          disabled={isLoaderSortDescending || isLoaderSortAscending}/></li>

        </ul>

        <ul className={"list list-row-butt"}>
          <li><Button sorting={Direction.Ascending} linkedList={"medium"} onClick={handlerOnClickAscending} text={"По возрастанию"} isLoader={isLoaderSortAscending}
                      disabled={isCanSortAscending}/>
          </li>
          <li>
            <Button sorting={Direction.Descending} linkedList={"medium"} onClick={handlerOnClickDescending} text={"По убыванию"} isLoader={isLoaderSortDescending}
                    disabled={isCanSortDescending}/>
          </li>
        </ul>

        <Button extraClass="ml-auto" linkedList={"medium"} onClick={handlerOnClickNewRandomValue} text={"Новый массив"}
                disabled={isLoaderSortDescending || isLoaderSortAscending}/>
      </div>
      {initialValue && <ul className="container-result container-result-type-sort list">
        {initialValue.map((element, index) => <li key={index}><ColumnMemo state={ElementStates.Default}
                                                                          index={element}/>
        </li>)}
      </ul>}
      {/*      {snapshots &&
        <StepByStepDisplay<TColumn> stateSnapshotsList={snapshots} setLoader={setIsCanSortDescending}
                                    content={content}/>}*/}
    </SolutionLayout>
  )
};
