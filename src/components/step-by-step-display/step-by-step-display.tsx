import {Queue} from "../../utils/queue";
import {TCheck} from "../../utils/reverse";
import React, {useState} from "react";
import {TItem} from "../../pages/string/string";
import {DELAY_IN_MS} from "../../constants/delays";

export const StepByStepDisplay = ({setLoader, data, stepsQueue, delay = DELAY_IN_MS, content}: {
    data: Array<TItem>,
    stepsQueue: Queue<TCheck>,
    delay?: number,
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
    content: (arr1: Array<TItem>) => JSX.Element
  }) => {
    const [arr, setArr] = useState<Array<TItem>>([]);
    const [countStep, setCountStep] = useState<number>(0)
    const [visualArr, setVisualArr] = useState<Array<TItem> | null>(null)

    React.useEffect(() => {
      setLoader(true)
      setArr(data)

    }, [data]);

    React.useEffect(() => {

        let stepsTimeoutId: NodeJS.Timeout;
        let stepsTimeoutId78: NodeJS.Timeout;

        if (countStep === 0) {
          setCountStep(1)
          setVisualArr(arr)
        }

        if (countStep > 0 && !stepsQueue.isEmpty() && visualArr && arr) {

          const newArr = [...arr];

          stepsTimeoutId = setTimeout(() => {


            const stepData = stepsQueue.peak()
            console.log(countStep, stepsQueue.isEmpty())

            stepData?.forEach((item) => {
              if (newArr) {
                newArr[item.number] = {value: item.value, number: item.number, state: item.state}
              }

            })

            stepsQueue.dequeue()
            setArr(newArr)
          }, delay);
        }

        if (countStep > 0 && !stepsQueue.isEmpty() && visualArr) {
          stepsTimeoutId78 = setTimeout(() => {
            console.log("Должно быть по таймеру")
            setCountStep(prevState => prevState + 1)
          }, delay);
        }

        if (countStep > 0 && stepsQueue.isEmpty() && visualArr) {
          setLoader(false)
        }

        return () => {
          clearTimeout(stepsTimeoutId);
          clearTimeout(stepsTimeoutId78)
        };
      }
      ,
      [arr, countStep, stepsQueue]
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