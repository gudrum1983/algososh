import React from "react";
import {Column} from "../ui/column/column";
import {TSnapshotSorting} from "../container-sorting/container-sorting";

type TVisualContentListProps<T> = { content: T };

export const VisualContentSorting = <T, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const ColumnMemo = React.memo(Column);

  // функция проверки типов так как я не смогла понять как указать в компоненте конкретный тип
  // и что бы это всё окончательно не сломалось
  function isSnapshotSorting(value: any): value is TSnapshotSorting {
    return value && (value as TSnapshotSorting).containerSorting !== undefined;
  }

  if (isSnapshotSorting(content)) {
    return (
      <ul className="container-result container-result-type-sort list">
        {content.containerSorting.map((element) =>
          <li key={element.id}>
            <ColumnMemo state={element.state} index={element.index}/>
          </li>
        )}
      </ul>
    );
  } else {
    return (<p>Ошибочка вышла...</p>);
  }
};
