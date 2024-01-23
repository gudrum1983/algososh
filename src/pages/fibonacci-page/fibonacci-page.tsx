import React, {useState} from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {Input} from "../../components/ui/input/input";
import {Button} from "../../components/ui/button/button";
import {StepByStepDisplay} from "../../components/step-by-step-display/step-by-step-display";
import {Circle} from "../../components/ui/circle/circle";
import {createFibonacciAndSnapshots} from "../../algorithms/create-fibonacci-and-snapshots/create-fibonacci-and-snapshots";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {CircleBaseElement} from "../../types/element-and-snapshot";

export type TElementFibonacci = Pick<CircleBaseElement, "letter" | "index" | "id">

export const FibonacciPage: React.FC = () => {

  const [inputValue, setInputValue] = useState<number | null>(null);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<Array<Array<TElementFibonacci>> | null>(null);
  const [memo, setMemo] = useState<Record<number, number> | null>(null);

  const delay = SHORT_DELAY_IN_MS;
  const max = 19
  const min = 1
  const stepNumber = 1
  const isCorrectNumber = Number(inputValue) >= min && Number(inputValue) <= max;

  function handlerOnClick(): void {
    if (inputValue) {
      setIsLoader(true);
      const [memory, snapshotsList] = createFibonacciAndSnapshots(inputValue, memo);
      setSnapshots(snapshotsList);
      setMemo(memory);
    }
  }

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.valueAsNumber);
  }

  const CircleMemo = React.memo(Circle);

  const createContent = (elementsList: Array<TElementFibonacci>) => {
    return (
      <ul className="container-result-fibb list">
        {elementsList.map((element) =>
          <li key={element.id}>
            <CircleMemo extraClass="fibb" index={element.index} letter={`${element.letter}`}/>
          </li>
        )}
      </ul>
    );
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div role="form" className="container-inputs-buttons container_type_fibb">
        <Input max={`${max}`} type={"number"} placeholder={`Введите число от ${min} до ${max}`} isLimitText={true}
               onChange={handlerOnChange} disabled={isLoader} min={`${min}`} step={`${stepNumber}`}/>
        <Button onClick={handlerOnClick} text={"Рассчитать"} isLoader={isLoader} disabled={!isCorrectNumber}/>
      </div>
      {snapshots &&
        <StepByStepDisplay<TElementFibonacci> steps={snapshots} setLoader={setIsLoader} childComponent={createContent}
                                              delay={delay}/>}
    </SolutionLayout>
  );
};
