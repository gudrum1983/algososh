import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ListContainer} from "../../components/list-container/list-container";

export const ListPage: React.FC = () => {
  return (
    <SolutionLayout title="Связный список">
      <ListContainer/>
    </SolutionLayout>
  );
};
