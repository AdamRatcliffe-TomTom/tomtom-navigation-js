import React from "react";
import { makeStyles, useTheme } from "@fluentui/react";
import HomeIcon from "../../icons/HomeIcon";
import WorkIcon from "../../icons/WorkIcon";
import StarIcon from "../../icons/StarIcon";
import ChargerIcon from "../../icons/ChargerIcon";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: "50%",
    width: 56,
    height: 56
  }
}));

const Button = ({ icon, borderColor = "#1988CF" }) => {
  const classes = useStyles();
  return (
    <div className={classes.button} style={{ borderColor }}>
      {icon}
    </div>
  );
};

const POIStrip = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button icon={<HomeIcon color={theme.palette.black} size={32} />} />
      <Button icon={<WorkIcon color={theme.palette.black} size={32} />} />
      <Button icon={<StarIcon color={theme.palette.black} size={32} />} />
      <Button
        icon={<ChargerIcon color={theme.palette.black} size={32} />}
        borderColor="#08B063"
      />
    </div>
  );
};

export default POIStrip;
