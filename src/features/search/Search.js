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

const useStyles = ({ top, isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top,
      left: 0,
      margin: theme.spacing.m,
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
      zIndex: 1000
    }
  }));

const styleId = "search-ctrl-margin-adjustment";

const Search = () => {
  const {
    isPhone,
    isTablet,
    safeAreaInsets: { top }
  } = useAppContext();
  const theme = useTheme();
  const classes = useStyles({ top, isPhone, isTablet })();

  useEffect(() => {
    if (isPhone) {
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
