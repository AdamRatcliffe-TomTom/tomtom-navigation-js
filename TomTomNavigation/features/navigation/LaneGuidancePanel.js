import React from "react";
import _isNil from "lodash.isnil";
import { makeStyles } from "@fluentui/react";
import Divider from "../../components/Divider";
import getLaneIcon from "../../functions/getLaneIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing.m
  },
  lanesContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 18,
    paddingTop: theme.spacing.m
  }
}));

const LaneGuidancePanel = ({ lanes }) => {
  const classes = useStyles();

  if (!lanes) return null;

  const renderLanes = () => {
    return lanes.map(({ directions, follow }, index) => {
      let direction;

      if (directions.length > 1 && !_isNil(follow)) {
        direction = follow;
      } else {
        direction = directions[0];
      }

      const icon = getLaneIcon(direction);
      const style = { ...(!!!follow && { opacity: 0.5 }) };

      return (
        <span key={index} className="LaneIcon" style={style}>
          {icon}
        </span>
      );
    });
  };

  return (
    <div className={classes.root}>
      <Divider color="white" />
      <div className={classes.lanesContainer}>{renderLanes()}</div>
    </div>
  );
};

export default LaneGuidancePanel;
