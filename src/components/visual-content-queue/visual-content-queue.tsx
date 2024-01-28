import React from "react";
import {Circle} from "../ui/circle/circle";
import {TElementQueue1} from "../../utils/utils";
import {ElementStates} from "../../types/element-states";
import {TNewSnapQueue} from "../../algorithms/queue-with-snaphots/gueue-with-snaphots";

type TVisualContentQueueProps<T> = { content: T };

export const VisualContentQueue = <T,>({content}: TVisualContentQueueProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isTNewSnapQueue(value: any): value is TNewSnapQueue<TElementQueue1> {
    return value && (value as TNewSnapQueue<TElementQueue1>).containerQueue !== undefined;
  }

  function getElementHead(elementsList: TNewSnapQueue<TElementQueue1>, index: number) {
    let headProp = null;
    if (index === elementsList.head) {
      headProp = {head: "head"};
    }
    return headProp;
  }

  function getElementState(elementsList: TNewSnapQueue<TElementQueue1>, index: number, element?: TElementQueue1) {
    let stateProp = null;
    if (index === elementsList.elementPointer) {
      stateProp = {state: ElementStates.Changing};
    } else if (element && elementsList.newElement === element) {
      stateProp = {state: ElementStates.Modified};
    }
    return stateProp;
  }

  function getElementTail(elementsList: TNewSnapQueue<TElementQueue1>, index: number) {
    let tailProp = null;
    if (index === elementsList.tail - 1) {
      tailProp = {tail: "tail"}
    }
    return tailProp
  }

  if (isTNewSnapQueue(content)) {
    return (
      <ul className="container-result list">
        {content && content.containerQueue.map((element, index) =>
          <li key={index}>
            {!element && <CircleMemo state={ElementStates.Default} letter={""}
                                     {...getElementState(content, index)}
                                     index={index} {...index === content.head && index !== 0 && {
              head: "head"
            }}/>}
            {element && <CircleMemo
              {...getElementState(content, index, element)}
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