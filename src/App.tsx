import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Login from "./components/Login";
import Taskflow from "./components/Taskflow";
import { api } from "./api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Oxygen", "sans-serif"`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const App: () => JSX.Element = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    window.localStorage.getItem("loggedIn") === "y" &&
      window.localStorage.getItem("username") != null &&
      window.localStorage.getItem("version") === "0.0.0"
  );

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Logging in");
      api.initDb(window.localStorage.getItem("username") ?? "");
    }
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Typography variant="h3" className="my-2">
          Taskflow
        </Typography>
        {isLoggedIn ? <Taskflow /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      </div>
    </ThemeProvider>
  );
};

export default App;
