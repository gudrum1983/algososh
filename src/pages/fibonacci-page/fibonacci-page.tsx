import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {FibonacciAlgorithmViewer} from "../../components/fibonacci-algorithm-viewer/fibonacci-algorithm-viewer";

export const FibonacciPage: React.FC = () => {
  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <FibonacciAlgorithmViewer/>
    </SolutionLayout>
  );
};