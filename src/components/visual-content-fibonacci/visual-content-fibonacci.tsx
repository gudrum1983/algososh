import React from "react";
import {Circle} from "../ui/circle/circle";
import {TSnapshotFibonacci} from "../container-fibonacci/container-fibonacci";
import styles from "./visual-content-fibonacci.module.css"

type TVisualContentListProps<T> = { content: T };

export const VisualContentFibonacci = <T, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isSnapshotFibonacci(value: any): value is TSnapshotFibonacci {
    return value && (value as TSnapshotFibonacci).containerFibonacci !== undefined;
  }

  if (isSnapshotFibonacci(content)) {
    return (
      <ul className={styles.containerResultFibonacci}>
        {content.containerFibonacci.map((element) =>
          <li key={element.id}>
            <CircleMemo extraClass={styles.elementFibonacci} index={element.index} letter={`${element.letter}`}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>);
  }
};
