import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {SortingAlgorithmViewer} from "../../components/sorting-algorithm-viewer/sorting-algorithm-viewer";

export const SortingPage: React.FC = () => {
  return (
    <SolutionLayout title="Сортировка массива">
      <SortingAlgorithmViewer/>
    </SolutionLayout>
  )
};