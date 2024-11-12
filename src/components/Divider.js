import React from "react";
import { makeStyles, useTheme } from "@fluentui/react";

const useStyles = ({ color }) =>
  makeStyles({
    root: {
      width: "100%",
      height: 1.5,
      background: color,
      opacity: 0.15
    }
  });

const Divider = ({ color = useTheme().palette.black }) => {
  const classes = useStyles({ color })();

  return <div className={`Divider ${classes.root}`} />;
};

export default Divider;
