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
    gap: 12,
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

      // The maneuver icons are being reused for lane guidance, and as the
      // icon horizontal padding differs a negative margin is used to adjust
      // for this.
      // A better solution might be to create an additional set of images
      // with no horizontal padding.
      const margin = getIconMargin(direction);
      const style = { margin, ...(!!!follow && { opacity: 0.5 }) };

      return (
        <span key={index} className="LaneIcon" style={style}>
          {icon}
        </span>
      );
    });
  };

  const getIconMargin = (direction) => {
    return ["LEFT", "RIGHT", "LEFT_UTURN", "RIGHT_UTURN"].includes(direction)
      ? "0"
      : "0 -8px";
  };

  return (
    <div className={classes.root}>
      <Divider color="white" />
      <div className={classes.lanesContainer}>{renderLanes()}</div>
    </div>
  );
};

export default LaneGuidancePanel;
