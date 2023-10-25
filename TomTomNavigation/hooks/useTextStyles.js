import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  primaryText: {
    fontSize: 24,
    fontWeight: 700
  },
  secondaryText: {
    color: theme.palette.neutralSecondaryAlt,
    fontSize: 20,
    fontWeight: 600
  }
}));

export default useTextStyles;
