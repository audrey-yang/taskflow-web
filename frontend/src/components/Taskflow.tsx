import { useState } from "react";
import Header from "./Header";
import TaskList from "./TaskList";
import { api } from "../api";
import { STATUS } from "../types";

const Taskflow = () => {
  // Lift state out of Header for refresh
  const [numUnstartedTasks, setNumUnstartedTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const getTaskCounts = async () => {
    setNumUnstartedTasks(
      await api.countChildTasksByStatus("", STATUS.NOT_STARTED)
    );
    setNumInProgressTasks(
      await api.countChildTasksByStatus("", STATUS.IN_PROGRESS)
    );
    setNumCompletedTasks(
      await api.countChildTasksByStatus("", STATUS.COMPLETED)
    );
  };

  return (
    <div>
      <Header
        numUnstartedTasks={numUnstartedTasks}
        numInProgressTasks={numInProgressTasks}
        numCompletedTasks={numCompletedTasks}
      />
      <TaskList refreshHeader={getTaskCounts} />
    </div>
  );
};

export default Taskflow;
