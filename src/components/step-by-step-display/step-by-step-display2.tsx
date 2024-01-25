import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
/*import {test} from "../../utils/confetti/confetti";*/

/*type TSteps<T> = {
  steps: Array<Array<T>> | Array<T>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  childComponent: (elementsList: Array<T> | T) => JSX.Element
}*/

type TStepsWithArray<T> = {
  steps: Array<T>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  childComponent: (elementsList: T) => JSX.Element
};

/*
type TStepsWithArrayOfArray<T> = {
  steps: Array<Array<T>>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  childComponent: (elementsList: Array<T>) => JSX.Element
};
*/

type TSteps<T> = TStepsWithArray<T>;

export const StepByStepDisplay2 = <T, >({setLoader, steps, delay = DELAY_IN_MS, childComponent}: TSteps<T>) => {

  const [obj, setObj] = useState<null | T>(null);

  const stepsQueue = React.useMemo(() => {
    if (steps) {
      return new Queue<T>(0, steps)
    }
    return null
  }, [steps])

  React.useEffect(() => {
    if (stepsQueue) {
      const stepData = stepsQueue.peak()
      if (stepData && typeof stepData === "object") {
        const newObj = {...stepData};
        setObj(newObj)
      }
      stepsQueue.dequeue()
    }
  }, [stepsQueue]);


  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (obj && stepsQueue && !stepsQueue.isEmpty()) {

      stepsTimeoutId = setTimeout(() => {
        const stepData = stepsQueue.peak()
        if (stepData && typeof stepData === "object") {
          const newObj = {...stepData};
          setObj(newObj)
        }
        stepsQueue.dequeue()
      }, delay);
    }

    if (obj && stepsQueue && stepsQueue.isEmpty()) {
      setLoader(false)
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [obj]);

  return (
    <>
      {obj && childComponent(obj)}
    </>
  );
};