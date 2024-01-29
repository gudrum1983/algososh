import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerList} from "../../components/container-list/container-list";

export const ListPage: React.FC = () => {
  return (
    <SolutionLayout title="Связный список">
      <ContainerList/>
    </SolutionLayout>
  );
};
