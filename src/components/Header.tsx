import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";

const Header = ({
  numUnstartedTasks,
  numInProgressTasks,
  numCompletedTasks,
}: {
  numUnstartedTasks: number;
  numInProgressTasks: number;
  numCompletedTasks: number;
}) => {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col my-5 sm:px-5 w-5/12 sm:w-auto">
        <Typography className="italic">At a glance</Typography>
        <Typography>Not started: {numUnstartedTasks}</Typography>
        <Typography>In progress: {numInProgressTasks}</Typography>
        <Typography>Completed: {numCompletedTasks}</Typography>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-row align-items-center w-7/12 sm:w-auto">
          <DateCalendar sx={{ margin: 0 }} readOnly />
          <div className="hidden sm:flex">
            <DateCalendar
              sx={{ margin: 0 }}
              readOnly
              referenceDate={dayjs().month(dayjs().month() + 1)}
            />
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default Header;
