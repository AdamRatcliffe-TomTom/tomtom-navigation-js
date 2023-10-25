import { makeStyles } from "@fluentui/react";

const useButtonStyles = makeStyles((theme) => ({
  largeButton: {
    height: 48,
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 24,
    color: "#fff",
    ":hover": {
      color: "#fff"
    },
    ":active": {
      color: "#fff"
    }
  },
  warningButton: {
    backgroundColor: theme.palette.red,
    borderColor: theme.palette.red,
    ":hover": {
      backgroundColor: theme.palette.redDark,
      borderColor: theme.palette.redDark,
      color: "#fff"
    },
    color: "#fff",
    ":active": {
      color: "#fff"
    }
  }
}));

export default useButtonStyles;
