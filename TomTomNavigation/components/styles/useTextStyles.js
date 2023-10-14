import { makeStyles } from "@fluentui/react";

const useTextStyles = makeStyles((theme) => ({
  secondaryText: {
    color: theme.palette.neutralSecondaryAlt,
    fontWeight: 600
  }
}));

export default useTextStyles;
