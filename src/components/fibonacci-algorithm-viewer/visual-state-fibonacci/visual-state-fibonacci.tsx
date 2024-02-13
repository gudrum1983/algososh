import React from "react";
import {Circle} from "../../ui/circle/circle";
import styles from "./visual-state-fibonacci.module.css"
import {ICircleComponent} from "../../../utils/circle";

type TVisualStateFibonacciProps<T extends ICircleComponent> = { state: Array<T> };
export const VisualStateFibonacci = <T extends ICircleComponent, >({state}: TVisualStateFibonacciProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  if (state) {
    return (
      <ul className={styles.containerResultFibonacci}>
        {state.map((element) =>
          <li key={element.index}>
            <CircleMemo extraClass={styles.elementFibonacci} index={element.index} letter={`${element.letter}`}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>);
  }
};