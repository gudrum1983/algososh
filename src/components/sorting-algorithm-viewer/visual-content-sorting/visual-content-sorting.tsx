import React from "react";
import {Column} from "../../ui/column/column";
import styles from "./visual-content-sorting.module.css"
import {IColumnComponent} from "../../../utils/column";

type TVisualContentListProps<T extends IColumnComponent> = { content: Array<T>};

export const VisualContentSorting = <T extends IColumnComponent, >({content}: TVisualContentListProps<T>): JSX.Element => {

  const ColumnMemo = React.memo(Column);

  if (content) {
    return (
      <ul className={styles.containerResultSorting}>
        {content.map((element) =>
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
