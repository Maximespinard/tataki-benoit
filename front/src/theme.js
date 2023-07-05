// mui theme is created here and passed to the MuiThemeProvider component
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#58C274", // change main color to green
    },
  },
});

export default theme;
