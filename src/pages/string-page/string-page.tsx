import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerString} from "../../components/container-string/container-string";

export const StringPage: React.FC = () => {
  return (
    <SolutionLayout title="Строка">
      <ContainerString/>
    </SolutionLayout>
  );
};