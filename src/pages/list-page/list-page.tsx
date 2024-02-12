import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {LinkListAlgoritmViewer} from "../../components/link-list-algoritm-viewer/link-list-algoritm-viewer";

export const ListPage: React.FC = () => {
  return (
    <SolutionLayout title="Связный список">
      <LinkListAlgoritmViewer/>
    </SolutionLayout>
  );
};