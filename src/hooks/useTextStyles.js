import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  primaryText: {
    fontFamily: "Noto Sans",
    fontSize: 24,
    fontWeight: 500
  },
  primaryUnitsText: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 500
  },
  secondaryText: {
    fontFamily: "Noto Sans",
    color: theme.palette.neutralSecondary,
    fontSize: 20,
    fontWeight: 400
  },
  tertiaryText: {
    fontFamily: "Noto Sans",
    color: theme.palette.black,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "1.5em"
  },
  tertiaryTextSemibold: {
    fontFamily: "Noto Sans",
    color: theme.palette.black,
    fontSize: 18,
    fontWeight: 500,
    lineHeight: "1.5em"
  },
  warningText: {
    fontFamily: "Noto Sans",
    color: theme.semanticColors.warningIcon,
    fontSize: 20,
    fontWeight: 400
  }
}));

export default useTextStyles;
