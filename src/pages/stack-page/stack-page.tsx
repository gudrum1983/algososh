import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {StackAlgorithmViewer} from "../../components/stack-algorithm-viewer/stack-algorithm-viewer";


export const StackPage: React.FC = () => {
  return (
    <SolutionLayout title="Стек">
      <StackAlgorithmViewer/>
    </SolutionLayout>
  );
};