import React from "react";
import {Circle} from "../ui/circle/circle";
import styles from "./visual-content-stack.module.css"
import {TSnapshotStack} from "../container-stack/container-stack";

type TVisualContentQueueProps<T> = { content: T };

export const VisualContentStack = <T,>({content}: TVisualContentQueueProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isTNewSnapStack(value: any): value is TSnapshotStack {
    return value && (value as TSnapshotStack).containerStack !== undefined;
  }

  if (isTNewSnapStack(content)) {
    return (
      <ul className={styles.containerResultStack}>
        {content.containerStack.map((element) =>
          <li key={element.id}>
            <CircleMemo state={element.state} letter={element.letter} index={element.index} {...element.top && {
              head: "top"
            }}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>)
  }
}