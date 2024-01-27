import React from "react";
import {Circle} from "../ui/circle/circle";
import {TNewSnapList} from "../../utils/linked-list";
import {TElementList} from "../../utils/utils";
import {LinkedListNode} from "../../utils/linked-list-node";
import {ElementStates} from "../../types/element-states";

type TRes<T> = { content: T };

export const ListResult = <T extends TNewSnapList<TElementList>, >({content}: TRes<T>): JSX.Element => {

    const CircleMemo = React.memo(Circle);

    function getElementHead(elementsList: TNewSnapList<TElementList>, index: number, element: LinkedListNode<TElementList>) {
      let headProp = null

      if (element === elementsList.elementPointer && elementsList.newToAdd) {
        headProp = {
          head:
            <CircleMemo letter={elementsList.newToAdd?.value.letter} state={ElementStates.Changing} isSmall={true}/>
        }
      } else if (index === 0) {
        headProp = {head: "head"}
      }

      return headProp
    }

    function getElementState(elementsList: TNewSnapList<TElementList>, element: LinkedListNode<TElementList>) {
      let stateProp = null
      if (element.value.id in elementsList.sectionPointer) {
        stateProp = {state: ElementStates.Changing}
      } else if (elementsList.newElement === element) {
        stateProp = {state: ElementStates.Modified}
      }
      return stateProp
    }

    function getElementTail(elementsList: TNewSnapList<TElementList>, index: number, element: LinkedListNode<TElementList>) {
      let tailProp = null
      if (element === elementsList.oldToRemove) {
        tailProp = {
          tail:
            <CircleMemo letter={elementsList.oldToRemove?.value.letter} state={ElementStates.Changing} isSmall={true}/>
        }
      } else if (index === content.container.length - 1) {
        tailProp = {tail: "tail"}
      }
      return tailProp
    }

    return (
      <ul className="container-result list">
        {content && content.container.map((element, index) =>
          <li key={element ? element.value.id : index}>
            {element &&
              <CircleMemo
                {...getElementState(content, element)}
                letter={content.removeElement === element ? "" : element.value.letter}
                index={index}
                {...getElementHead(content, index, element)}
                {...getElementTail(content, index, element)}
              />}
          </li>)}
      </ul>
    );
  }
;