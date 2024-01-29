import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerSorting} from "../../components/container-sorting/container-sorting";

export const SortingPage: React.FC = () => {
  return (
    <SolutionLayout title="Сортировка массива">
      <ContainerSorting/>
    </SolutionLayout>
  )
};