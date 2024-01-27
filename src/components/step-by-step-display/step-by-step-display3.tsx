import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {useLocation} from "react-router-dom";
import {ListResult} from "../list-result/list-result";
import {TElementString} from "../../pages/string-page/string-page";
import {TNewSnapList} from "../../utils/linked-list";
import {TElementList} from "../../utils/utils";
/*import {test} from "../../utils/confetti/confetti";*/

type TStepsWithArray<T> = {
  steps: Array<T>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
};

type TSteps<T> = TStepsWithArray<T>;

export const StepByStepDisplay3 = <T extends TNewSnapList<TElementList>, >({setLoader, steps, delay = DELAY_IN_MS}: TSteps<T>) => {

  console.log({steps})

  let location = useLocation()

  const [obj, setObj] = useState<null | T>(null);
  const stepsQueue = React.useMemo(() => {
    if (steps) {
      return new Queue<T>(0, steps)
    }
    return null
  }, [steps])

  console.log("stepsQueue")
  console.log(stepsQueue)
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
      {obj && location.pathname === "/list" && <ListResult<TNewSnapList<TElementList>> content={obj}/>}
    </>
  );
};