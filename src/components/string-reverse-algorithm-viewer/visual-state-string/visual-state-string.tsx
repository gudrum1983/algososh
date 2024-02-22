import React from "react";
import {Circle} from "../../ui/circle/circle";
import styles from "./visual-state-string.module.css"
import {IStateCircleElement} from "../../../utils/circle";

type TVisualStateStringProps<T extends IStateCircleElement> = { state: Array<T> };

export const VisualStateString = <T extends IStateCircleElement, >({state}: TVisualStateStringProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  if (state) {
    return (
      <ul className={styles.containerResultString}>
        {state.map((element: T) =>
          <li key={element.index}>
            <CircleMemo state={element.state} letter={element.letter}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>);
  }
};