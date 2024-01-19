import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {TElements} from "../../pages/string/string";
import {DELAY_IN_MS} from "../../constants/delays";

export const StepByStepDisplay = ({setLoader, data, stepsQueue, delay = DELAY_IN_MS, content}: {
    data: TElements,
    stepsQueue: Queue<TElements>,
    delay?: number,
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
    content: (elementsList: TElements) => JSX.Element
  }) => {
    const [arr, setArr] = useState<TElements>([]);
    const [countStep, setCountStep] = useState<number>(0)
    const [visualArr, setVisualArr] = useState<TElements | null>(null)

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
            stepData?.forEach((item) => {
              if (newArr) {
                const test = newArr.find((newItem) => newItem.id === item.id)
                if (test) {
                  test.value = item.value
                  test.state = item.state
                }
              }
            })

            stepsQueue.dequeue()
            setArr(newArr)
          }, delay);
        }

        if (countStep > 0 && !stepsQueue.isEmpty() && visualArr) {
          stepsTimeoutId78 = setTimeout(() => {
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

    return (
      <>
        {content(arr)}
      </>
    );
  }
;