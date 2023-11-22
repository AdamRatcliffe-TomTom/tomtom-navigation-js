import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  primaryText: {
    fontFamily: "Noto Sans",
    fontSize: 28,
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
    fontSize: 18,
    fontWeight: 400
  },
  warningText: {
    fontFamily: "Noto Sans",
    color: theme.semanticColors.warningIcon,
    fontSize: 18,
    fontWeight: 500
  }
}));

export default useTextStyles;
