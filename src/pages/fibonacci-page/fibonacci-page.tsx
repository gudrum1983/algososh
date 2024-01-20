import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {Circle} from "../../components/ui/circle/circle";
import {
  calculateFibonacciWithMemoization
} from "../../algorithms/get-fibo-num-with-history/calculate-fibonacci-with-memoization";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export type TElementFibb = {
  value: number,
  id: string,
  order: number
}

export const FibonacciPage: React.FC = () => {

  const [inputValue, setInputValue] = useState<number | null>(null)
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [snapshots, setSnapshots] = useState<Array<Array<TElementFibb>> | null>(null)
  const [memo, setMemo] = useState<Record<number, number> | null>(null)

  function handlerOnClick(): void {
    if (inputValue) {
      setIsLoader(true)
      const [memory, snapshotsList] = calculateFibonacciWithMemoization(inputValue, memo)
      setSnapshots(snapshotsList)
      setMemo(memory)
    }
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.valueAsNumber)
  }


  const CircleMemo = React.memo(Circle);

  const content = (elementsList: Array<TElementFibb>) => {
    return (
      <ul className="container-result-fibb list">
        {elementsList.map((element) => <li key={element.id}><CircleMemo extraClass="fibb" index={element.order}
                                                                        letter={`${element.value}`}/>
        </li>)}
      </ul>
 )
    ;
  }

  const isCorrectNumber = Number(inputValue) >= 1 && Number(inputValue) <= 19


  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div role="form" className="container-inputs-buttons container_type_fibb">
        <Input max={19} type={"number"} placeholder={"Введите число от 1 до 19"} isLimitText={true} onChange={handlerOnChange}
               disabled={isLoader} min="1" step="1"/>
        <Button onClick={handlerOnClick} text={"Рассчитать"} isLoader={isLoader} disabled={!isCorrectNumber}/>
      </div>
      {snapshots &&
        <StepByStepDisplay<TElementFibb> stateSnapshotsList={snapshots} setLoader={setIsLoader} content={content} delay={SHORT_DELAY_IN_MS}/>}
    </SolutionLayout>
  );
};
