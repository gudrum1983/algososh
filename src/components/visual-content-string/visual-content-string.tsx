import React from "react";
import {Circle} from "../ui/circle/circle";
import {TSnapshotReverseString} from "../container-string/container-string";

type TVisualContentListProps<T> = { content: T };

export const VisualContentString = <T, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const CircleMemo = React.memo(Circle);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isTNewSnapString(value: any): value is TSnapshotReverseString {
    return value && (value as TSnapshotReverseString).containerString !== undefined;
  }

  if (isTNewSnapString(content)) {
    return (
      <ul className="container-result list">
        {content.containerString.map((element) =>
          <li key={element.id}>
            <CircleMemo state={element.state} letter={element.letter}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>);
  }
};