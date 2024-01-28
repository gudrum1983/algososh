import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {useLocation} from "react-router-dom";
import {VisualContentList} from "../visual-content-list/visual-content-list";
import {TNewSnapList} from "../../utils/linked-list";
import {Buttons, TElementList} from "../../utils/utils";
/*import {test} from "../../utils/confetti/confetti";*/

type TSteps<T> = {
  steps: Array<T>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<false | Buttons>>,
};

export const StepByStepDisplay3 = <T extends TNewSnapList<TElementList>, >({
                                                                             setLoader,
                                                                             steps,
                                                                             delay = DELAY_IN_MS
                                                                           }: TSteps<T>) => {

  let location = useLocation();

  const [step, setStep] = useState<null | T>(null);

  const stepsQueue = React.useMemo(() => {
    if (steps) {
      return new Queue<T>(0, steps);
    }
    return null;
  }, [steps]);

  function extractQueueStep(stepsQueue: Queue<T>) {
    const stepData = stepsQueue.peak();
    if (stepData) {
      const stepCopy = {...stepData};
      setStep(stepCopy);
    }
    stepsQueue.dequeue();
  }


  React.useEffect(() => {
    if (stepsQueue) {
      extractQueueStep(stepsQueue)
    }
  }, [stepsQueue]);


  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (stepsQueue && !stepsQueue.isEmpty()) {
      stepsTimeoutId = setTimeout(() => {
        extractQueueStep(stepsQueue);
      }, delay);
    }

    if (stepsQueue && stepsQueue.isEmpty()) {
      setLoader(false);
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [step]);

  return (
    <>
      {step && location.pathname === "/list" && <VisualContentList<TNewSnapList<TElementList>> content={step}/>}
    </>
  );
};