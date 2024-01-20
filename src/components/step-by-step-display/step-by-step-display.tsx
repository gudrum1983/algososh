import {Queue} from "../../utils/queue";
import React, {useState} from "react";
import {TElements, TSnapshots} from "../../pages/string/string";
import {DELAY_IN_MS} from "../../constants/delays";

export const StepByStepDisplay = ({setLoader, stateSnapshotsList, delay = DELAY_IN_MS, content}: {
  stateSnapshotsList: TSnapshots<TElements>
  delay?: number,
  setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  content: (elementsList: TElements) => JSX.Element
}) => {
  const [arr, setArr] = useState<TElements | null>(null);

  const stepsQueue = React.useMemo(() => {
    if (stateSnapshotsList) {
      return new Queue<TElements>(10, stateSnapshotsList)
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

    if (stepsQueue && stepsQueue.isEmpty()) {
      setLoader(false)
    }

    return () => {
      clearTimeout(stepsTimeoutId);
    };
  }, [arr]);

  return (
    <ul className="container-result list">
      {arr && content(arr)}
    </ul>
  );
};