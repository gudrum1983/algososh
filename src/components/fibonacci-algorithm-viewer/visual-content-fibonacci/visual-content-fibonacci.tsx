import React from "react";
import {Circle} from "../../ui/circle/circle";
import styles from "./visual-content-fibonacci.module.css"
import {ICircleComponent} from "../../../utils/circle";

type TVisualContentListProps<T extends ICircleComponent> = { content: Array<T> };
export const VisualContentFibonacci = <T extends ICircleComponent, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  if (content) {
    return (
      <ul className={styles.containerResultFibonacci}>
        {content.map((element) =>
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
