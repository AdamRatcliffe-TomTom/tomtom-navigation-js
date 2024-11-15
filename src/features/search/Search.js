import React, { useEffect } from "react";
import { makeStyles, useTheme, Stack } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import SearchBox from "./SearchBox";
import POIStrip from "./POIStrip";
import {
  addStyleToDocument,
  removeStyleFromDocument
} from "../../functions/styles";

import { TABLET_PANEL_WIDTH } from "../../config";

const useStyles = ({ position, top, isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      ...(position === "bottom" ? { bottom: 0 } : { top }),
      left: 0,
      margin: isPhone ? theme.spacing.s1 : theme.spacing.m,
      padding: `${theme.spacing.m} ${theme.spacing.l1}`,
      backgroundColor: theme.palette.white,
      borderRadius: theme.spacing.m,
      boxShadow: theme.floatingElementShadow,
      ...(isTablet && {
        width: TABLET_PANEL_WIDTH
      }),
      ...(isPhone && {
        right: 0
      }),
      transition: "background-color 0.15s",
      zIndex: 1000,
      ...(position === "bottom" && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0
      })
    }
  }));

const styleId = "search-ctrl-margin-adjustment";

const Search = ({ position }) => {
  const {
    isPhone,
    isTablet,
    safeAreaInsets: { top }
  } = useAppContext();
  const theme = useTheme();
  const classes = useStyles({ position, top, isPhone, isTablet })();

  useEffect(() => {
    if (isPhone && position === "top") {
      removeStyleFromDocument(styleId);
      addStyleToDocument(
        styleId,
        `.TomTomNavigation .mapboxgl-ctrl-top-right, .TomTomNavigation .mapboxgl-ctrl-top-left {
          margin-top: ${top + 160 + 16}px;
        }
          `
      );
    } else {
      return () => removeStyleFromDocument(styleId);
    }
    return () => removeStyleFromDocument(styleId);
  }, []);

  return (
    <div className={classes.root}>
      <Stack tokens={{ childrenGap: theme.spacing.m }} horizontal={false}>
        <SearchBox />
        <POIStrip />
      </Stack>
    </div>
  );
};

export default Search;
