import { makeStyles } from "@fluentui/react";

const useButtonStyles = makeStyles((theme) => ({
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    minWidth: "auto",
    ":active": {
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  },
  pillButton: {
    minWidth: 75,
    fontFamily: "Noto Sans",
    fontSize: 16,
    fontWeight: 400,
    height: 48,
    borderRadius: 24,
    color: theme.palette.black,
    ":hover": {
      color: theme.palette.black
    },
    ":active": {
      color: theme.palette.black,
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  },
  pillButtonLarge: {
    minWidth: 75,
    fontFamily: "Noto Sans",
    fontSize: 18,
    fontWeight: 400,
    height: 56,
    borderRadius: 28,
    color: theme.palette.black,
    ":hover": {
      color: theme.palette.black
    },
    ":active": {
      color: theme.palette.black,
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  },
  mapControlButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: theme.palette.white,
    boxShadow: "0 0 35px 0 rgba(0, 0, 0, 0.25)",
    userSelect: "none",
    cursor: "pointer",
    ":active": {
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  }
}));

export default useButtonStyles;
