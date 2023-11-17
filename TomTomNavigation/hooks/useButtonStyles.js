import { makeStyles } from "@fluentui/react";

const useButtonStyles = makeStyles((theme) => ({
  circleButton: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: "50%",
    minWidth: "auto"
  },
  pillButton: {
    minWidth: 75,
    fontFamily: "Noto Sans",
    fontSize: 16,
    fontWeight: 400,
    height: 48,
    borderWidth: 2,
    borderRadius: 24,
    color: theme.palette.black,
    "&.ms-Button--primary": {
      color: "white"
    }
  },
  pillButtonLarge: {
    minWidth: 75,
    fontFamily: "Noto Sans",
    fontSize: 18,
    fontWeight: 400,
    height: 56,
    borderWidth: 2,
    borderRadius: 28,
    color: theme.palette.black,
    ":hover": {
      color: theme.palette.black
    },
    ":active": {
      color: theme.palette.black
    },
    "&.ms-Button--primary": {
      color: "white"
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
    boxShadow: theme.floatingElementShadow,
    userSelect: "none",
    cursor: "pointer",
    ":active": {
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  }
}));

export default useButtonStyles;
