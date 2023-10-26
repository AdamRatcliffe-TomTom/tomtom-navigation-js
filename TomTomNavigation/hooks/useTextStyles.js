import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  primaryText: {
    fontSize: 24,
    fontWeight: 600
  },
  primaryUnitsText: {
    fontSize: 17,
    fontWeight: 500
  },
  secondaryText: {
    color: theme.palette.neutralSecondary,
    fontSize: 18,
    fontWeight: 500
  },
  warningText: {
    color: theme.semanticColors.surfaceContentCritical,
    fontSize: 18,
    fontWeight: 500
  }
}));

export default useTextStyles;
