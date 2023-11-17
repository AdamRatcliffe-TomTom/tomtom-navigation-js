import React from "react";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 1.5,
    background: theme.palette.black,
    opacity: 0.15
  }
}));

const Divider = () => {
  const classes = useStyles();
  return <div className={`Divider ${classes.root}`} />;
};

export default Divider;
