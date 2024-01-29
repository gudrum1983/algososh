import React from "react";
import {Circle} from "../ui/circle/circle";
import {LinkedListNode, TNewSnapList} from "../../algorithms/linked-list-with-snapshots/linked-list-with-snapshots";
import {ElementStates} from "../../types/element-states";
import styles from "./visual-content-list.module.css";

type TVisualContentListProps<T> = { content: T };

type Ttest = TNewSnapList<string>

export const VisualContentList = <T, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isTNewSnapList(value: any): value is Ttest {
    return value && (value as Ttest).containerList !== undefined;
  }

  function getElementHead(elementsList: Ttest, index: number, element: LinkedListNode<string>) {
    let headProp = null;
    if (element === elementsList.elementPointer && elementsList.newToAdd) {
      headProp = {
        head:
          <CircleMemo letter={elementsList.newToAdd?.letter} state={ElementStates.Changing} isSmall={true}/>
      };
    } else if (index === 0) {
      headProp = {head: "head"};
    }
    return headProp;
  }

  function getElementState(elementsList: TNewSnapList<string>, element: LinkedListNode<string>) {
    let stateProp = null;
    if (elementsList.sectionPointer && element.id in elementsList.sectionPointer) {
      stateProp = {state: ElementStates.Changing};
    } else if (elementsList.newElement === element) {
      stateProp = {state: ElementStates.Modified};
    }
    return stateProp;
  }

  function getElementTail(elementsList: TNewSnapList<string>, index: number, element: LinkedListNode<string>) {
    let tailProp = null;
    if (element === elementsList.oldToRemove) {
      tailProp = {
        tail:
          <CircleMemo letter={elementsList.oldToRemove?.letter} state={ElementStates.Changing} isSmall={true}/>
      };
    } else if (index === elementsList.containerList.length - 1) {
      tailProp = {tail: "tail"}
    }
    return tailProp
  }

  if (isTNewSnapList(content)) {
    return (
      <ul className={styles.containerResultList}>
        {content && content.containerList.map((element, index) =>
          <>
            <li key={element ? element.id : index}>
              {element && <CircleMemo
                {...getElementState(content, element)}
                letter={content.removeElement === element ? "" : element.letter}
                index={index}
                {...getElementHead(content, index, element)}
                {...getElementTail(content, index, element)}
              />}
            </li>
            {element && content.tail !== element && <li key={`${index} + icon`} className={styles.arrows}/>}
          </>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла</p>)
  }
};