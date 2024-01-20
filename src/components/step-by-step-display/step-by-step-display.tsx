import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {DELAY_IN_MS} from "../../constants/delays";
import {test} from "../../utils/confetti/confetti";

type TSteps<T> = {
  stateSnapshotsList: Array<Array<T>>
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  content: (elementsList: Array<T>) => JSX.Element
}


export const StepByStepDisplay = <T,>({setLoader, stateSnapshotsList, delay = DELAY_IN_MS, content}: TSteps<T>) => {
  const [arr, setArr] = useState<Array<T> | null>(null);

  const stepsQueue = React.useMemo(() => {
    if (stateSnapshotsList) {
      return new Queue<Array<T>>(0, stateSnapshotsList)
    }
    return null
  }, [stateSnapshotsList])

  React.useEffect(() => {
    if (stepsQueue) {
      const stepData = stepsQueue.peak()
      const newArr2 = stepData && [...stepData];
      setArr(newArr2)
      stepsQueue.dequeue()
    }


  }, [stepsQueue]);


  React.useEffect(() => {

    let stepsTimeoutId: NodeJS.Timeout;

    if (arr && stepsQueue && !stepsQueue.isEmpty()) {

      stepsTimeoutId = setTimeout(() => {
        const stepData = stepsQueue.peak()
        const newArr2 = stepData && [...stepData];
        setArr(newArr2)
        stepsQueue.dequeue()

      }, delay);
    }

    if (arr && stepsQueue && stepsQueue.isEmpty()) {
      setLoader(false)
      test()
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [arr]);

  return (
    <>
      {arr && content(arr)}
    </>
  );
};