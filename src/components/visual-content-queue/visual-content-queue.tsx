import React from "react";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import styles from "./visual-content-queue.module.css"
import {TElementQueue} from "../queue-algorithm-viewer/queue-algorithm-viewer";
import {TNewSnapQueue} from "../queue-algorithm-viewer/utils";
type TVisualContentQueueProps<T> = { content: T };

export const VisualContentQueue = <T,>({content}: TVisualContentQueueProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isTNewSnapQueue(value: any): value is TNewSnapQueue<TElementQueue> {
    return value && (value as TNewSnapQueue<TElementQueue>).containerQueue !== undefined;
  }

  function getElementHead(elementsList: TNewSnapQueue<TElementQueue>, index: number) {
    let headProp = null;
    if (index === elementsList.head) {
      headProp = {head: "head"};
    }
    return headProp;
  }

  function getElementState(elementsList: TNewSnapQueue<TElementQueue>, index: number) {
    let stateProp = null;
    if (index === elementsList.elementPointer) {
      stateProp = {state: ElementStates.Changing};
    }
    return stateProp;
  }

  function getElementTail(elementsList: TNewSnapQueue<TElementQueue>, index: number) {
    let tailProp = null;
    if (index === elementsList.tail - 1) {
      tailProp = {tail: "tail"}
    }
    return tailProp
  }

  if (isTNewSnapQueue(content)) {
    return (
      <ul className={styles.containerResultQueue}>
        {content && content.containerQueue.map((element, index) =>
          <li key={index}>
            {!element && <CircleMemo state={ElementStates.Default} letter={""}
                                     {...getElementState(content, index)}
                                     index={index} {...index === content.head && index !== 0 && {
              head: "head"
            }}/>}
            {element && <CircleMemo
              {...getElementState(content, index)}
              letter={element.letter}
              index={index}
              {...getElementHead(content, index)}
              {...getElementTail(content, index)} />
            }
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>)
  }
}