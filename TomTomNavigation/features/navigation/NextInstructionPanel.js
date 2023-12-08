import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import RoadShield from "./roadshield/RoadShield";
import getRoadShield from "./roadshield/getRoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getManeuverIcon from "../../functions/getManeuverIcon";
import formatDistance from "../../functions/formatDistance";

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
    fontSize: 28,
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
  towards: {
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

const NextInstructionPanel = ({ route, instruction }) => {
  if (!route || !instruction) {
    return null;
  }

  const theme = useTheme();
  const { landscapeMinimal, measurementSystem } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles();
  const textClasses = useTextStyles();
  const distanceToNextManeuver = useSelector(getDistanceToNextManeuver);
  const formattedDistanceToNextManeuver = formatDistance(
    distanceToNextManeuver,
    measurementSystem
  );
  const {
    maneuver,
    street,
    signpostText,
    roadShieldReferences,
    signpostRoadShieldReferences,
    exitNumber
  } = instruction;
  const maneuverIcon = getManeuverIcon(maneuver);
  const haveRoadShieldReferences = !!roadShieldReferences;
  const haveSignpostRoadShieldReferences = !!signpostRoadShieldReferences;
  const roadShieldsAreVisible =
    haveRoadShieldReferences || haveSignpostRoadShieldReferences;
  const exitNumberIsVisible = !!exitNumber;
  const streetIsVisible = !landscapeMinimal && !!street && !!!signpostText;
  const towardsIsVisible = !landscapeMinimal && !!signpostText;

  const renderRoadShields = () => {
    const references = signpostRoadShieldReferences || roadShieldReferences;
    return references.map((ref, index) => {
      const { reference, shieldContent, affixes } = ref;
      const icon = getRoadShield(reference, shieldContent);
      return <RoadShield key={index} icon={icon} affixes={affixes} />;
    });
  };

  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;

  return (
    <div className={`NextInstructionPanel ${classes.root}`}>
      <Stack horizontalAlign="center" horizontal>
        {maneuverIcon}
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
          {exitNumberIsVisible && <ExitShield text={exitNumber} />}
        </Stack>
        {streetIsVisible && <Text className={classes.street}>{street}</Text>}
        {towardsIsVisible && (
          <Text className={classes.towards}>{signpostText}</Text>
        )}
        {roadShieldsAreVisible && (
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
