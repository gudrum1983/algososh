import React from "react";
import {SolutionLayout} from "../../components/ui/solution-layout/solution-layout";
import {ContainerQueue} from "../../components/container-queue/container-queue";

export const QueuePage: React.FC = () => {
  return (
    <SolutionLayout title="Очередь">
      <ContainerQueue/>
    </SolutionLayout>
  );
};