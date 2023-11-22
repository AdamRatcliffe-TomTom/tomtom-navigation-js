import React from "react";
import _isNil from "lodash.isnil";
import { makeStyles } from "@fluentui/react";
import getLaneIcon from "../../functions/getLaneIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing.m
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

  return <div className={classes.root}>{renderLanes()}</div>;
};

export default LaneGuidancePanel;
