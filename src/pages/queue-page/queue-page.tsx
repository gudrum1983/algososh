import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {QueueContainer} from "../../components/queue-container/queue-container";

export const QueuePage: React.FC = () => {
  return (
    <SolutionLayout title="Очередь">
      <QueueContainer/>
    </SolutionLayout>
  );
};
