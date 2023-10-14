import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  primaryText: {
    fontSize: "24px",
    fontWeight: 700
  },
  secondaryText: {
    color: theme.palette.neutralSecondaryAlt,
    fontSize: "20px",
    fontWeight: 600
  }
}));

export default useTextStyles;
