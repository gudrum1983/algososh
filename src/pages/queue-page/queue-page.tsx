import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {QueueAlgorithmViewer} from "../../components/queue-algorithm-viewer/queue-algorithm-viewer";

export const QueuePage: React.FC = () => {
  return (
    <SolutionLayout title="Очередь">
      <QueueAlgorithmViewer/>
    </SolutionLayout>
  );
};