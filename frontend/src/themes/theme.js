import { createTheme } from "@material-ui/core/styles";
import palettes from "./palletes";

const theme = createTheme({
  palette: {
    primary: {
      main: palettes.palette1.primary,
    },
    secondary: {
      main: palettes.palette1.secondary,
    },
    tertiary: {
      main: palettes.palette1.tertiary,
    },
    quaternary: {
      main: palettes.palette1.quaternary,
    },
    accent: {
      main: palettes.palette1.accent,
    },
  },
});

export default theme;
