import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {useLocation} from "react-router-dom";
import {startConfetti} from "../confetti/confetti";
import {Buttons} from "../../types/buttons";
import {Path} from "../../types/path";
import {IStateCircleElement} from "../../utils/circle";
import {VisualStateString} from "../string-reverse-algorithm-viewer/visual-state-string/visual-state-string";
import {VisualStateFibonacci} from "../fibonacci-algorithm-viewer/visual-state-fibonacci/visual-state-fibonacci";
import {IColumnComponent} from "../../utils/column";
import {VisualStateSorting} from "../sorting-algorithm-viewer/visual-state-sorting/visual-state-sorting";
import {Caretaker, Originator} from "../../utils/memento";

type TSteps<T extends IStateCircleElement & IColumnComponent> = {
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<null | Buttons>>,
  state: Originator<T[]>;
  snapshotStorage: Caretaker<T[]>
};

export const StepByStepDisplay = <T extends IStateCircleElement & IColumnComponent, >({
                                                                                     setLoader,
                                                                                     state,
                                                                                     snapshotStorage,
                                                                                     delay = DELAY_IN_MS
                                                                                   }: TSteps<T>) => {

  let location = useLocation();

  const [step, setStep] = useState<Array<T> | null>(null);

  const updateStep = () => {
    snapshotStorage.retrieveAndRemoveSnapshot();
    const currentStep = state.getState();
    currentStep && setStep(currentStep);
  };

  React.useEffect(() => {
    if (state) {
      updateStep();
    }
  }, [state, snapshotStorage]);

  React.useEffect(() => {

    const isEmpty = snapshotStorage.isEmpty();
    let stepsTimeoutId: NodeJS.Timeout;
    if (!isEmpty) {
      stepsTimeoutId = setTimeout(() => {
        updateStep();
      }, delay);
    } else {
      setLoader(null);
      snapshotStorage.clear();
      startConfetti();
    }
    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [step, snapshotStorage, state, delay]);

  return (
    <>
      {step && location.pathname === Path.string && <VisualStateString<T> state={step}/>}
      {step && location.pathname === Path.sorting && <VisualStateSorting<T> state={step}/>}
      {step && location.pathname === Path.fibonacci && <VisualStateFibonacci<T> state={step}/>}
    </>
  );
};