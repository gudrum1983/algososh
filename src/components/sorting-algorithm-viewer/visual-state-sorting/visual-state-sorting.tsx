import React from "react";
import {Column} from "../../ui/column/column";
import styles from "./visual-state-sorting.module.css"
import {IColumnComponent} from "../../../utils/column";

type TVisualStateSortingProps<T extends IColumnComponent> = { state: Array<T>};

export const VisualStateSorting = <T extends IColumnComponent, >({state}: TVisualStateSortingProps<T>): JSX.Element => {

  const ColumnMemo = React.memo(Column);

  if (state) {
    return (
      <ul className={styles.containerResultSorting}>
        {state.map((element) =>
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