import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react";

const useStyles = ({ padding, safeAreaInsets }) =>
  makeStyles({
    root: {
      position: "absolute",
      top: padding.top,
      right: padding.right,
      bottom: padding.bottom,
      left: padding.left,
      border: "1px solid lime",
      pointerEvents: "none",
      zIndex: 1000
    },
    crosshair: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 0,
      height: 0,
      pointerEvents: "none"
    },
    verticalLine: {
      position: "absolute",
      width: "1px",
      height: "20px",
      backgroundColor: "lime",
      top: "-10px",
      left: 0,
      transform: "translateX(-50%)"
    },
    horizontalLine: {
      position: "absolute",
      width: "20px",
      height: "1px",
      backgroundColor: "lime",
      top: 0,
      left: "-10px",
      transform: "translateY(-50%)"
    },
    widthLabel: {
      position: "absolute",
      top: padding.top === 0 ? safeAreaInsets.top : 10,
      left: "50%",
      transform: "translateX(-50%)",
      color: "lime",
      fontSize: "14px",
      lineHeight: "1em"
    },
    heightLabel: {
      position: "absolute",
      top: "50%",
      left: 10 + safeAreaInsets.left,
      transform: "translateY(-50%)",
      color: "lime",
      fontSize: "14px",
      lineHeight: "1em"
    }
  });

const FieldOfView = ({
  padding,
  safeAreaInsets,
  containerWidth,
  containerHeight
}) => {
  const classes = useStyles({ padding, safeAreaInsets })();

  const fovWidth = containerWidth - padding.left - padding.right;
  const fovHeight = containerHeight - padding.top - padding.bottom;

  return (
    <div className={`FieldOfView ${classes.root}`}>
      <div className={classes.crosshair}>
        <div className={classes.verticalLine} />
        <div className={classes.horizontalLine} />
      </div>
      <div className={classes.widthLabel}>{`Width: ${fovWidth}px`}</div>
      <div className={classes.heightLabel}>{`Height: ${fovHeight}px`}</div>
    </div>
  );
};

export const useFieldOfView = (
  mapRef,
  debug,
  safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 },
  dependencies = []
) => {
  const [padding, setPadding] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (!debug) return; // Skip calculation if not in debug mode

    const map = mapRef.current?.getMap();
    if (map) {
      const updateDimensions = () => {
        const container = map.getContainer();
        if (container) {
          const { offsetWidth: width, offsetHeight: height } = container;
          setContainerDimensions({ width, height });
        }

        const padding = map.__om.getPadding();
        setPadding(padding);
      };

      // Initial calculation
      updateDimensions();

      // Add resize listener
      map.on("resize", updateDimensions);

      // Cleanup listener on unmount
      return () => {
        map.off("resize", updateDimensions);
      };
    }
  }, [debug, mapRef.current, ...dependencies]);

  // Return the FieldOfView component only when debugging and padding is available
  return debug && padding ? (
    <FieldOfView
      padding={padding}
      safeAreaInsets={safeAreaInsets}
      containerWidth={containerDimensions.width}
      containerHeight={containerDimensions.height}
    />
  ) : null;
};
