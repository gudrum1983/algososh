import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {StringReverseAlgorithmViewer} from "../../components/string-reverse-algorithm-viewer/string-reverse-algorithm-viewer";

export const StringPage: React.FC = () => {
  return (
    <SolutionLayout title="Строка">
      <StringReverseAlgorithmViewer/>
    </SolutionLayout>
  );
};