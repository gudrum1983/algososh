import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Button} from "../../components/ui/button/button";
import {RadioInput} from "../../components/ui/radio-input/radio-input";
import {Column} from "../../components/ui/column/column";
import {ElementStates} from "../../types/element-states";
import {Direction} from "../../types/direction";
import {randomNumbers} from "../../utils/random-numbers";
import {sortBubble} from "../../algorithms/sort/sort";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {createInitElements, copyAndResetElementStates} from "../../utils/utils";
import {sortSelect} from "../../algorithms/sort/sortSelect";

const bubble = "bubble"

const selection = "selection"

export type Sort = typeof bubble | typeof selection

export type TColumn = {
  index: number,
  state: ElementStates,
  id: string
}


export const SortingPage: React.FC = () => {

  const [initialValue, setInitialValue] = useState<Array<TColumn> | null>(null)
  const [isLoaderSortDescending, setIsLoaderSortDescending] = useState<boolean>(false)
  const [isLoaderSortAscending, setIsLoaderSortAscending] = useState<boolean>(false)
  const [typeSort, setTypeSort] = useState<Sort>("selection")
  const [snapshots, setSnapshots] = useState<Array<Array<TColumn>> | null>(null)


  React.useEffect(() => {

    const newArr = randomNumbers()
    const test = createInitElements(newArr)
    setInitialValue(test)

  }, [])

  function handlerOnClickDescending(): void {
    setIsLoaderSortDescending(true)
    startSort(typeSort, Direction.Descending)
  }

  function handlerOnClickAscending(): void {
    setIsLoaderSortAscending(true)
    startSort(typeSort, Direction.Ascending)
  }

  function handlerOnClickNewRandomValue(): void {
    setSnapshots(null)
    const newArr = randomNumbers()
    const test = createInitElements(newArr)

    setInitialValue(test)
  }

  function startSort(type: Sort, route: Direction) {
    console.log(`Запуск сортировки тип ${type} направление ${route}`)
    if (initialValue && type == selection) {
      const snap = sortSelect(initialValue, route)
      setSnapshots(snap)
      setInitialValue(copyAndResetElementStates(snap[snap.length - 1]))
    }
    if (initialValue && type == bubble) {
      const snap = sortBubble(initialValue, route)
      setSnapshots(snap)
      setInitialValue(copyAndResetElementStates(snap[snap.length - 1]))
    }

  }

  function endLoader(v: boolean) {
    setIsLoaderSortAscending(v)
    setIsLoaderSortDescending(v)
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === bubble) {
      setTypeSort(bubble)

    } else {
      setTypeSort(selection)
    }


  }

  const ColumnMemo = React.memo(Column);

  const content = (elementsList: Array<TColumn>) => {
    return (
      <ul className="container-result container-result-type-sort list">{elementsList.map((element, index) => <li
        key={element.id}><ColumnMemo state={element.state}
                                     index={element.index}/>
      </li>)}
      </ul>
    );
  }


  return (
    <SolutionLayout title="Сортировка массива">
      <div role="form" className="container-inputs-buttons container_type_sort">
        <ul className={"list list-row"}>
          <li><RadioInput extraClass={"m-0 mr-20"} onChange={handlerOnChange} value={selection} label={"Выбор"}
                          defaultChecked name={"typeSort"}
                          disabled={isLoaderSortDescending || isLoaderSortAscending}/></li>
          <li><RadioInput extraClass="mr-20" onChange={handlerOnChange} value={bubble} label={"Пузырёк"}
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
      {initialValue && !snapshots && content(initialValue)}
      {snapshots &&
        <StepByStepDisplay<TColumn> stateSnapshotsList={snapshots}
                                    setLoader={isLoaderSortDescending ? setIsLoaderSortDescending : setIsLoaderSortAscending}
                                    content={content} delay={500}/>}
    </SolutionLayout>
  )
};
