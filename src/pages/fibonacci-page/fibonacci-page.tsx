import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerFibonacci} from "../../components/container-fibonacci/container-fibonacci";

export const FibonacciPage: React.FC = () => {
  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <ContainerFibonacci/>
    </SolutionLayout>
  );
};