import { useState, lazy } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SelectChangeEvent } from "@mui/material/Select";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Priority, priorityToColor, STATUS, Status } from "../types";
import {
  notesEditor,
  prioritySelect,
  statusSelect,
  titleEditor,
} from "./EditComponents";
import { api } from "../api";

const TaskList = lazy(() => import("./TaskList"));

const Task = ({
  _id,
  title,
  priority,
  status,
  note,
  refresh,
}: {
  _id: string;
  title: string;
  priority: Priority;
  status: Status;
  note: string;
  refresh: () => Promise<void>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [taskPriority, setTaskPriority] = useState(priority);
  const [taskStatus, setTaskStatus] = useState(status);
  const [taskNote, setTaskNote] = useState(note);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNote, setNewNote] = useState(note);

  // Change handlers
  const changePriority = async (event: SelectChangeEvent) => {
    const newPriority = event.target.value as unknown as Priority;
    await api.changeTaskPriority(_id, newPriority);
    setTaskPriority(newPriority);
    await refresh();
  };
  const changeStatus = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value as unknown as Status;
    await api.changeTaskStatus(_id, newStatus);
    setTaskStatus(newStatus);
    await refresh();
  };
  const changeTitle = async (newTitle: string) => {
    await api.changeTaskTitle(_id, newTitle);
    setTaskTitle(newTitle);
    setIsEditingTitle(false);
  };
  const changeNote = async (note: string) => {
    await api.changeTaskNote(_id, note);
    setTaskNote(note);
    setIsEditingNote(false);
  };
  const deleteTask = async () => {
    await api.deleteTask(_id);
    await refresh();
  };

  return (
    <Accordion
      expanded={isExpanded}
      disableGutters
      sx={{
        borderTop: "solid 1px #e5e7eb",
        backgroundClip: "padding-box",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ArrowForwardIosSharpIcon
            sx={{ fontSize: "0.9rem" }}
            className="mx-1"
            onClick={() => setIsExpanded((prev) => !prev)}
          />
        }
        sx={{
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          padding: 0,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center w-full px-2">
          <div className="w-full sm:w-1/2 px-2">
            <div className="flex flex-row items-center">
              <CircleIcon
                sx={{ color: priorityToColor(taskPriority) }}
                className="px-1"
              />
              {isEditingTitle ? (
                <>
                  {titleEditor(newTitle, setNewTitle, changeTitle)}
                  <ButtonGroup size="small" aria-label="Submit or cancel">
                    <IconButton
                      aria-label="done"
                      onClick={() => changeTitle(newTitle)}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="cancel"
                      onClick={() => setIsEditingTitle(false)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </ButtonGroup>
                </>
              ) : (
                <>
                  <div className="w-10/12 font-semibold">{taskTitle}</div>
                  <ButtonGroup size="small" aria-label="Submit or cancel">
                    <IconButton
                      aria-label="edit"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={deleteTask}>
                      <DeleteIcon />
                    </IconButton>
                  </ButtonGroup>
                </>
              )}
            </div>
          </div>
          <div className="w-full sm:w-1/2 flex flex-row">
            <div className="w-1/2 px-2">
              {prioritySelect(taskPriority, changePriority)}
            </div>
            <div className="w-1/2 px-2">
              {statusSelect(taskStatus, changeStatus)}
            </div>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="ml-4">
          <div className="flex flex-row mb-2">
            {notesEditor(newNote, setNewNote, !isEditingNote)}
            {isEditingNote ? (
              <ButtonGroup size="small" aria-label="Submit or cancel">
                <IconButton
                  aria-label="done"
                  onClick={() => changeNote(newNote)}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  aria-label="cancel"
                  onClick={() => {
                    setNewNote(taskNote);
                    setIsEditingNote(false);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </ButtonGroup>
            ) : (
              <IconButton
                aria-label="edit"
                onClick={() => setIsEditingNote(true)}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <TaskList
            parentId={_id}
            parentIsCompleted={status == STATUS.COMPLETED}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Task;
