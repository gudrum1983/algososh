import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {useLocation} from "react-router-dom";
import {startConfetti} from "../confetti/confetti";
import {Buttons} from "../../types/buttons";
import {Path} from "../../types/path";
import {ICircleComponent} from "../../utils/circle";
import {VisualStateString} from "../string-reverse-algorithm-viewer/visual-state-string/visual-state-string";
import {VisualContentFibonacci} from "../fibonacci-algorithm-viewer/visual-content-fibonacci/visual-content-fibonacci";
import {IColumnComponent} from "../../utils/column";
import {VisualContentSorting} from "../sorting-algorithm-viewer/visual-content-sorting/visual-content-sorting";
import {SimpleContent, SimpleSnapshotStorage} from "../../utils/simple-snapshot-storage";


type TSteps<T extends ICircleComponent & IColumnComponent> = {
  steps: Array<Array<T>>,
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<null | Buttons>>,
};

export const StepByStepDisplay = <T extends ICircleComponent & IColumnComponent, >({
                                                                                     setLoader,
                                                                                     steps,
                                                                                     delay = DELAY_IN_MS
                                                                                   }: TSteps<T>) => {

  let location = useLocation();

  const [step, setStep] = useState<null | Array<T>>(null);

  const stepsQueue = React.useMemo(() => {
    if (steps) {
      return new Queue<Array<T>>(0, steps);
    }
    return null;
  }, [steps]);

  function extractQueueStep(stepsQueue: Queue<Array<T>>) {
    const stepData = stepsQueue.peak();
    if (stepData) {
      const stepCopy = [...stepData];
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
      startConfetti();
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [step]);

  return (
    <>
      {step && location.pathname === Path.fibonacci && <VisualContentFibonacci<T> content={step}/>}
      {step && location.pathname === Path.sorting && <VisualContentSorting<T> content={step}/>}
    </>
  );
};

type TSteps2<T extends ICircleComponent & IColumnComponent> = {
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<null | Buttons>>,
  state: SimpleContent<T[]>;
  snapshotStorage:  SimpleSnapshotStorage<T[]>
};

export const StepByStepDisplay2 = <T extends ICircleComponent & IColumnComponent, >({
                                                                                      setLoader,                                                                                  
                                                                                      state,
                                                                                      snapshotStorage,
                                                                                      delay = DELAY_IN_MS
                                                                                    }: TSteps2<T>) => {

  let location = useLocation();

  const [step, setStep] = useState<Array<T> | null>(null);

  console.log({state})
  console.log({step})

  React.useEffect(() => {
    console.log("1", state)
    if (state) {
      console.log("2", state.getState())
      snapshotStorage.retrieveAndRemoveSnapshot()
      const currentStep = state.getState();
      console.log("bbbb", currentStep)
      currentStep && setStep(currentStep);
      debugger
    }

  }, [state]);

  React.useEffect(() => {

    const isEmpty = snapshotStorage.isEmpty()
    console.log({step})
    console.log({isEmpty})
    let stepsTimeoutId: NodeJS.Timeout;
    debugger
    if (!isEmpty) {
      stepsTimeoutId = setTimeout(() => {
        snapshotStorage.retrieveAndRemoveSnapshot()
        const currentStep = state.getState();
        currentStep && setStep(currentStep);

      }, delay);
    }

    if (isEmpty) {
      setLoader(null);
      snapshotStorage.clear();
      startConfetti();
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [step, snapshotStorage, state]);

   return (
    <>
      {step && location.pathname === Path.string && <VisualStateString<T> state={step}/>}
    </>
  );
};