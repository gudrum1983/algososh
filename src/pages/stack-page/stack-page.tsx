import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerStack} from "../../components/container-stack/container-stack";

export const StackPage: React.FC = () => {
  return (
    <SolutionLayout title="Стек">
      <ContainerStack/>
    </SolutionLayout>
  );
};
