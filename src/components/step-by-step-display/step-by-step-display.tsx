import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {useLocation} from "react-router-dom";
import {VisualContentList} from "../visual-content-list/visual-content-list";
import {VisualContentString} from "../visual-content-string/visual-content-string";
import {VisualContentFibonacci} from "../visual-content-fibonacci/visual-content-fibonacci";
import {VisualContentSorting} from "../visual-content-sorting/visual-content-sorting";
import {startConfetti} from "../confetti/confetti";
import {Buttons} from "../../types/buttons";
import {Path} from "../../types/path";

type TSteps<T> = {
  steps: Array<T>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<null | Buttons>>,
};

export const StepByStepDisplay = <T, >({setLoader, steps, delay = DELAY_IN_MS}: TSteps<T>) => {

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
      setLoader(null);
      if (location.pathname === Path.string
        || location.pathname === Path.sorting
        || location.pathname === Path.fibonacci) {
        startConfetti();
      }
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [step]);

  return (
    <>
      {step && location.pathname === Path.list && <VisualContentList<T> content={step}/>}
      {step && location.pathname === Path.string && <VisualContentString<T> content={step}/>}
      {step && location.pathname === Path.fibonacci && <VisualContentFibonacci<T> content={step}/>}
      {step && location.pathname === Path.sorting && <VisualContentSorting<T> content={step}/>}
    </>
  );
};