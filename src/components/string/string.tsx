import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Circle} from "../ui/circle/circle";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";
import {reverseWithHistory, TCheck} from "../../utils/reverse";
import {Queue} from "../../utils/queue";

export type TItem = {
  value: string,
  number: number,
  state: ElementStates
}

const StepByStepDisplay = ({setLoader, str, queue, delay = 1000, content}: {
  str: Array<TItem>,
  queue: Queue<TCheck>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  content:  (arr1: Array<TItem>) => JSX.Element
  }) => {
  const [arr, setArr] = useState<Array<TItem>>([]);
  const [countStep, setCountStep] = useState<number>(0)
  const [visualArr, setVisualArr] = useState<Array<TItem> | null>(null)

  console.log(`reverseComp - ${countStep}`, queue)


  /*  const [currentIndex, setCurrentIndex] = useState(0);*/
  /*  React.useEffect(() => {
      if (currentIndex < arr.length / 2) {
        setTimeout(() => {
          const newArr = [...arr]; // Создаем копию массива
          // Меняем местами элементы в копии массива
          newArr[currentIndex] = arr[arr.length - 1 - currentIndex];
          newArr[arr.length - 1 - currentIndex] = arr[currentIndex];

          setArr(newArr); // Обновляем состояние с новым массивом
          setCurrentIndex(currentIndex + 1); // Перемещаем указатель на следующий шаг
        }, delay);
      }
    }, [arr, currentIndex]);*/


  React.useEffect(() => {
    setLoader(true)
    setArr(str)

  }, [str]);

  React.useEffect(() => {

      let stepsTimeoutId: NodeJS.Timeout;
      let stepsTimeoutId78: NodeJS.Timeout;

      if (countStep === 0) {
        setCountStep(1)
        setVisualArr(arr)
      }

      if (countStep > 0 && !queue.isEmpty() && visualArr && arr) {

        const newArr = [...arr]; // Создаем копию массива

        //////------------------------------------------------------------------------
        stepsTimeoutId = setTimeout(() => {


          const stepData = queue.peak()
          console.log(countStep, queue.isEmpty())

          //////////////////////////////////////////////////////////
          stepData?.forEach((item) => {
            if (newArr) {
              const newI = {value: item.value, number: item.number, state: item.state}
              newArr[item.number] = newI
            }
            /*              setCountStep(prevState => prevState + 1)*/
          })
          ///////////////////////////////////////////////////////////
          queue.dequeue()
          setArr(newArr)
          /*          // Меняем местами элементы в копии массива
                    newArr[currentIndex] = arr[arr.length - 1 - currentIndex];
                    newArr[arr.length - 1 - currentIndex] = arr[currentIndex];

                    setArr(newArr); // Обновляем состояние с новым массивом
                    setCurrentIndex(currentIndex + 1); // Перемещаем указатель на следующий шаг*/
        }, delay);
        //////------------------------------------------------------------------------


      }

      if (countStep > 0 && !queue.isEmpty() && visualArr) {
        stepsTimeoutId78 = setTimeout(() => {
          console.log("Должно быть по таймеру")
          setCountStep(prevState => prevState + 1)
        }, delay);
      }

      if (countStep > 0 && queue.isEmpty() && visualArr) {
        setLoader(false)
      }

      return () => {
        clearTimeout(stepsTimeoutId);
        clearTimeout(stepsTimeoutId78)
      };
    }
    ,
    [arr, countStep, queue]
  )
  ;

/*  const content = (arr1: Array<TItem>) => {return (
      <div className="container-result">
        {visualArr && arr1.map((item) => <Circle state={item.state} letter={item.value} key={item.number}/>)}
      </div>
    );}*/


return (
  <>
    {content(arr)}
  </>

/*  <div className="container-result">
    {visualArr && arr.map((item) => <Circle state={item.state} letter={item.value} key={item.number}/>)}
    {/!*      {reverseLetters && result2(reverseLetters)}*!/}
  </div>*/
);
}
;
export const StringComponent: React.FC = () => {

  const [inputString, setInputString] = useState<string>("")
  const [isLoader, setIsLoader] = useState(false)

  const [letters, setLetters] = useState<Array<TItem> | null>(null)


  function handlerOnClick() {


    if (inputString) {
      setIsLoader(true)
      const mappingLetters = inputString.split('').map((item, index) => ({
        number: index,
        value: item,
        state: ElementStates.Default
      }))
      setLetters(mappingLetters)
    }
  }

  const reverseQueue = React.useMemo(() => {
    if (letters) {
      const stepsQueue = new Queue<TCheck>(20)
      reverseWithHistory(letters, stepsQueue)
      console.log("newStepQueue", stepsQueue)
      if (stepsQueue) {
        setIsLoader(false)
      }
      return stepsQueue
    }
    return null
  }, [letters])

  /*  React.useEffect(() => {
      let stepsTimeoutId: NodeJS.Timeout;

      if (reverseQueue && !reverseQueue.isEmpty()) {
        let step = 0

        stepsTimeoutId = setTimeout(() => {
          while (!reverseQueue.isEmpty() && step < 4) {
            console.log(reverseQueue.peak())
            reverseQueue.dequeue();
            step++
          }
        }, 1000);
      }

      return () => {
        clearTimeout(stepsTimeoutId);

      };

    }, [reverseQueue]);*/

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputString(e.target.value)
  }

  const result = (array: Array<TItem>): JSX.Element => {
    return (
      <div className="container-result">
        {array.map((item) => <Circle state={item.state} letter={item.value} key={item.number}/>)}
      </div>)
  }

  React.useEffect(() => {
    console.log("Поменялась inputString")

  }, [inputString]);

  React.useEffect(() => {
    console.log("Поменялась isLoader")

  }, [isLoader]);

  React.useEffect(() => {
    console.log("Поменялась str")

  }, [letters]);


  const content = (arr1: Array<TItem>) => {return (
    <div className="container-result">
      {arr1.map((item) => <Circle state={item.state} letter={item.value} key={item.number}/>)}
    </div>
  );}

  return (
    <SolutionLayout title="Строка">
      <div className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={inputString} disabled={isLoader}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!inputString}/>
      </div>
      <div className="container-result-column">
        {reverseQueue && letters &&
          <StepByStepDisplay str={letters} queue={reverseQueue} setLoader={setIsLoader} content={content}/>}
      </div>

    </SolutionLayout>
  );
};

