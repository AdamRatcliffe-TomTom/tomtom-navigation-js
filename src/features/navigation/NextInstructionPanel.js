import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import _capitalize from "lodash.capitalize";
import { useNavigationContext } from "../../core/NavigationContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import RoadShield from "./roadshield/RoadShield";
import getRoadShield from "./roadshield/getRoadShield";
import bearingToNearestDirection from "../../functions/bearingToNearestDirection";
import getManeuverIcon from "../../functions/getManeuverIcon";
import getDirectionIcon from "../../functions/getDirectionIcon";
import formatDistance from "../../functions/formatDistance";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import Maneuvers from "../../constants/Maneuvers";
import strings from "../../config/strings";

import {
  getSpriteImageUrl,
  getSpriteJson,
  getCountryCode
} from "../map/mapSlice";
import { getDistanceToNextManeuver } from "./navigationSlice";

const DepartContainer = ({
  classes,
  textClasses,
  direction,
  street,
  pedestrianRoute
}) => {
  let text =
    direction !== strings.unknown
      ? strings.formatString(strings.headInDirectionTemplate, { direction })
      : pedestrianRoute
      ? strings.DEPART_PEDESTRIAN
      : strings.DEPART;

  if (street) {
    text += ` ${strings.on}`;
  }

  return (
    <Stack className={classes.departContainer}>
      <Text className={`${textClasses.primaryText} ${classes.depart}`}>
        {text}
      </Text>
    </Stack>
  );
};

const DistanceContainer = ({
  classes,
  textClasses,
  formattedDistanceToNextManeuver,
  exitNumberIsVisible,
  countryCode
}) => {
  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;
  return (
    <Stack
      className={classes.distanceContainer}
      verticalAlign="center"
      horizontalAlign="space-between"
      horizontal
    >
      <Text className={`${textClasses.primaryText} ${classes.distance}`}>
        {`${formattedDistanceToNextManeuver.value} ${formattedDistanceToNextManeuver.units}`}
      </Text>
      {exitNumberIsVisible && <ExitShield text={exitNumberIsVisible} />}
    </Stack>
  );
};

const useStyles = ({ textColor }) =>
  makeStyles((theme) => ({
    root: {
      display: "grid",
      gridTemplateColumns: "56px 1fr",
      gap: theme.spacing.m
    },
    departContainer: {
      marginBottom: theme.spacing.s1
    },
    distanceContainer: {
      marginBottom: theme.spacing.s1
    },
    depart: {
      fontSize: 24,
      color: textColor
    },
    distance: {
      fontSize: 28,
      color: textColor
    },
    street: {
      fontFamily: "Noto Sans",
      fontSize: 20,
      color: textColor,
      lineHeight: "1.5",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    towards: {
      fontFamily: "Noto Sans",
      fontSize: 20,
      color: textColor,
      lineHeight: "1.5",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    affixes: {
      fontFamily: "Noto Sans",
      fontSize: 20,
      fontWeight: 600,
      color: textColor
    }
  }));

const NextInstructionPanel = ({ route, instruction }) => {
  if (!route || !instruction) {
    return null;
  }

  const theme = useTheme();
  const {
    theme: navigationTheme,
    landscapeMinimal,
    measurementSystem
  } = useNavigationContext();

  const pedestrianRoute = isPedestrianRoute(route?.features[0]);
  const textColor =
    pedestrianRoute && navigationTheme === "light" ? "black" : "white";
  const classes = useStyles({ textColor })();
  const textClasses = useTextStyles();
  const countryCode = useSelector(getCountryCode);
  const spriteImageUrl = useSelector(getSpriteImageUrl);
  const spriteJson = useSelector(getSpriteJson);
  const distanceToNextManeuver = useSelector(getDistanceToNextManeuver);
  const shouldRoundDistance = !pedestrianRoute;
  const formattedDistanceToNextManeuver = formatDistance(
    distanceToNextManeuver,
    measurementSystem,
    false,
    shouldRoundDistance
  );
  const {
    maneuver,
    street,
    signpostText,
    towards,
    roadShieldReferences,
    signpostRoadShieldReferences,
    exitNumber,
    turnAngleInDecimalDegrees
  } = instruction;
  const direction = bearingToNearestDirection(turnAngleInDecimalDegrees);
  const maneuverIcon = getManeuverIcon(maneuver, {
    color: textColor
  });
  const directionIcon = getDirectionIcon(direction);

  if (!maneuverIcon) {
    console.error(`Couldn't find icon for maneuver ${maneuver}`);
  }

  const isDeparture = maneuver === Maneuvers.DEPART;
  const haveRoadShieldReferences = !!roadShieldReferences;
  const haveSignpostRoadShieldReferences = !!signpostRoadShieldReferences;
  const roadShieldsAreVisible =
    haveRoadShieldReferences || haveSignpostRoadShieldReferences;
  const exitNumberIsVisible = !!exitNumber;
  const streetIsVisible = !landscapeMinimal && !!street && !!!signpostText;
  const towardsIsVisible = !landscapeMinimal && (!!signpostText || !!towards);

  const renderRoadShields = () => {
    const references = signpostRoadShieldReferences || roadShieldReferences;
    return references.map((ref, index) => {
      const { reference, shieldContent, affixes } = ref;
      const icon = getRoadShield(
        reference,
        shieldContent,
        spriteImageUrl,
        spriteJson
      );
      return <RoadShield key={index} icon={icon} affixes={affixes} />;
    });
  };

  return (
    <div className={`NextInstructionPanel ${classes.root}`}>
      <Stack horizontalAlign="center" horizontal>
        {isDeparture ? directionIcon : maneuverIcon}
      </Stack>
      <Stack grow="1">
        {isDeparture ? (
          <DepartContainer
            classes={classes}
            textClasses={textClasses}
            direction={direction}
            street={street}
            pedestrianRoute={pedestrianRoute}
          />
        ) : (
          <DistanceContainer
            classes={classes}
            textClasses={textClasses}
            formattedDistanceToNextManeuver={formattedDistanceToNextManeuver}
            exitNumberIsVisible={exitNumberIsVisible}
            countryCode={countryCode}
          />
        )}
        {streetIsVisible && <Text className={classes.street}>{street}</Text>}
        {towardsIsVisible && (
          <Text className={classes.towards}>
            {_capitalize(signpostText || towards)}
          </Text>
        )}
        {roadShieldsAreVisible && (
          <Stack
            tokens={{ childrenGap: theme.spacing.s1 }}
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
