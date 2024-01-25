import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {TSnapshot} from "../../types/element-and-snapshot";
import {TNewSnap} from "../../algorithms/create-queue-snaphots/create-gueue-snaphots";
import {TElementQueue1} from "../../utils/utils";
/*import {test} from "../../utils/confetti/confetti";*/

type TSteps<T> = {
  steps: Array<Array<T>>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  childComponent: (elementsList: Array<T> ) => JSX.Element
}


export const StepByStepDisplay = <T,>({setLoader, steps, delay = DELAY_IN_MS, childComponent}: TSteps<T>) => {

  const [arr, setArr] = useState<TSnapshot<T> | null >(null);

  const stepsQueue = React.useMemo(() => {
    if (steps) {
      return new Queue<Array<T>>(0, steps)
    }
    return null
  }, [steps])

  React.useEffect(() => {
    if (stepsQueue) {
      const stepData:T | T[] | null = stepsQueue.peak()
      if (Array.isArray(stepData)){
        const newArr2 = [...stepData];
        setArr(newArr2)
      }
      stepsQueue.dequeue()
    }
  }, [stepsQueue]);


  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (arr && stepsQueue && !stepsQueue.isEmpty()) {

      stepsTimeoutId = setTimeout(() => {
        const stepData = stepsQueue.peak()
        if (Array.isArray(stepData)){
          const newArr2 = [...stepData];
          setArr(newArr2)

        }
        stepsQueue.dequeue()
      }, delay);
    }

    if (arr && stepsQueue && stepsQueue.isEmpty()) {
      setLoader(false)
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [arr]);

  return (
    <>
      {arr && childComponent(arr)}
    </>
  );
};