import { Suspense, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Task from "./Task";
import NewTask from "./NewTask";
import { DBTask } from "../types";
import { api } from "../api";

const TaskList = ({
  parentId,
  parentIsCompleted,
  refreshHeader,
}: {
  parentId?: string;
  parentIsCompleted?: boolean;
  refreshHeader?: () => void;
}) => {
  parentIsCompleted = parentIsCompleted ?? false;
  const [incompleteTasks, setIncompleteTasks] = useState<DBTask[]>([]);
  const [completeTasks, setCompleteTasks] = useState<DBTask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const populateTasks = async (tries?: number) => {
    try {
      setIncompleteTasks(await api.getChildTasksIncomplete(parentId ?? ""));
      setCompleteTasks(await api.getChildTasksComplete(parentId ?? ""));
      if (!parentId && refreshHeader) {
        // Refresh the header only at the top level
        refreshHeader();
      }
    } catch (err) {
      // Retry if PouchDB fails
      if (tries === undefined) {
        tries = 0;
      }

      if (tries > 3) {
        throw err;
      } else {
        await populateTasks(tries + 1);
      }
    }
  };

  useEffect(() => {
    populateTasks();
  }, []);

  return (
    <div>
      {parentIsCompleted ? null : (
        <NewTask parentId={parentId ?? ""} onTaskAdded={populateTasks} />
      )}
      <Suspense fallback={<div>Loading... </div>}>
        {incompleteTasks.map((task) => (
          <Task key={task._id} {...task} refresh={populateTasks} />
        ))}
      </Suspense>
      {completeTasks.length > 0 ? (
        <div>
          <Button
            onClick={() => setShowCompleted((prev) => !prev)}
            sx={{
              margin: "0.5rem auto",
            }}
          >
            {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
          </Button>
          <Suspense fallback={<div>Loading... </div>}>
            {showCompleted
              ? completeTasks.map((task) => (
                  <Task key={task._id} {...task} refresh={populateTasks} />
                ))
              : null}
          </Suspense>
        </div>
      ) : null}
    </div>
  );
};

export default TaskList;
