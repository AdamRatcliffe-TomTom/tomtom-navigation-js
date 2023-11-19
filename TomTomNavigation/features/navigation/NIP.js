import React from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import KeepLeft from "../../icons/arrows/KeepLeft";
import useTextStyles from "../../hooks/useTextStyles";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";

const useStyles = ({ isPhone, isTablet, countryCode }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: theme.spacing.m,
      padding: theme.spacing.l1,
      height: 175,
      borderRadius: theme.spacing.m,
      background:
        countryCode === "US"
          ? theme.semanticColors.nipUSBackground
          : theme.semanticColors.nipEUBackground,
      boxShadow: theme.floatingElementShadow,
      zIndex: 10,
      ...(isTablet && {
        width: 380
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      })
    },
    distance: {
      color: "white"
    }
  }));

const NIP = ({ route }) => {
  const theme = useTheme();
  const { isPhone, isTablet } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({ isPhone, isTablet, countryCode })();
  const textClasses = useTextStyles();

  return (
    <div className={`NIP ${classes.root}`}>
      <Stack tokens={{ childrenGap: theme.spacing.s1 }} horizontal>
        <KeepLeft />
        <Text className={`${textClasses.primaryText} ${classes.distance}`}>
          600 ft
        </Text>
      </Stack>
    </div>
  );
};

export default NIP;
