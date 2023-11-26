import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import getRoadShield from "./roadshield/getRoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getNextInstructionIcon from "../../functions/getNextInstructionIcon";
import formatDistance from "../../functions/formatDistance";
import expandDirectionAbbreviation from "../../functions/expandDirectionAbbreviation";

import { getDistanceToNextManeuver } from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: theme.spacing.m
  },
  distanceContainer: {
    marginBottom: theme.spacing.s1
  },
  distance: {
    color: "white"
  },
  street: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    color: "white",
    lineHeight: "1.5",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  affixes: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 600,
    color: "white"
  }
}));

const NextInstructionPanel = ({ route, nextInstruction }) => {
  const theme = useTheme();
  const { measurementSystem } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles();
  const textClasses = useTextStyles();
  const distanceToNextManeuver = useSelector(getDistanceToNextManeuver);
  const formattedDistanceToNextManeuver = formatDistance(
    distanceToNextManeuver,
    measurementSystem
  );
  const { maneuver, street, signpostText } = nextInstruction;
  const { roadShieldReferences, exitNumber } = nextInstruction;
  const nextInstructionIcon = getNextInstructionIcon(maneuver);
  const hasRoadShields = !!roadShieldReferences;
  const haveExitNumber = !!exitNumber;

  const renderRoadShields = () => {
    if (roadShieldReferences) {
      return roadShieldReferences.map((ref) => {
        const { reference, shieldContent, affixes } = ref;
        const icon = getRoadShield(reference, shieldContent);

        return (
          <Stack
            tokens={{ childrenGap: theme.spacing.s2 }}
            verticalAlign="center"
            horizontal
          >
            {icon}
            {affixes && affixes.length > 0 && (
              <Text className={classes.affixes}>
                {affixes.map(expandDirectionAbbreviation).join(" ")}
              </Text>
            )}
          </Stack>
        );
      });
    }

    return null;
  };

  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;

  return (
    <div className={`NextInstructionPanel ${classes.root}`}>
      <Stack horizontalAlign="center" horizontal>
        {nextInstructionIcon}
      </Stack>
      <Stack grow="1">
        <Stack
          className={classes.distanceContainer}
          verticalAlign="center"
          horizontalAlign="space-between"
          horizontal
        >
          <Text className={`${textClasses.primaryText} ${classes.distance}`}>
            {`${formattedDistanceToNextManeuver.value} ${formattedDistanceToNextManeuver.units}`}
          </Text>
          {haveExitNumber && <ExitShield text={exitNumber} />}
        </Stack>
        <Text className={classes.street}>{street || signpostText}</Text>
        {hasRoadShields && (
          <Stack
            tokens={{ childrenGap: theme.spacing.m }}
            horizontal
            verticalAlign="center"
            style={{
              marginTop: theme.spacing.s2
            }}
          >
            {renderRoadShields()}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

export default NextInstructionPanel;
