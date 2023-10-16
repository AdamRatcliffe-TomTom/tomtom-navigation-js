import { makeStyles } from "@fluentui/react";

const useButtonStyles = makeStyles((theme) => ({
  largeButton: {
    height: "48px",
    fontSize: "20px",
    fontWeight: 700,
    borderRadius: "24px"
  },
  warningButton: {
    backgroundColor: theme.palette.red,
    borderColor: theme.palette.red,
    ":hover": {
      backgroundColor: theme.palette.redDark,
      borderColor: theme.palette.redDark
    }
  }
}));

export default useButtonStyles;
