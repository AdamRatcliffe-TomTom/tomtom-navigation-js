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

const useDynamicStyles = ({ position, top, isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      ...(position === "bottom" ? { bottom: 0 } : { top }),
      ...(isTablet && { width: TABLET_PANEL_WIDTH, margin: theme.spacing.m }),
      ...(isPhone && { right: 0, margin: theme.spacing.s1 }),
      ...(position === "bottom" && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0
      })
    }
  }));

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: 0,
    padding: `${theme.spacing.m} ${theme.spacing.l1}`,
    backgroundColor: theme.palette.white,
    borderRadius: theme.spacing.m,
    boxShadow: theme.floatingElementShadow,
    transition: "background-color 0.15s",
    zIndex: 1000
  }
}));

const useSearchStyles = ({ position, top, isPhone, isTablet }) => {
  const staticStyles = useStyles();
  const dynamicStyles = useDynamicStyles({
    position,
    top,
    isPhone,
    isTablet
  })();

  return `${staticStyles.root} ${dynamicStyles.root}`;
};

const useSafeAreaAdjustments = (isPhone, position, top) => {
  useEffect(() => {
    if (isPhone && position === "top") {
      const marginTop = top + 160 + 16;
      addStyleToDocument(
        styleId,
        `.TomTomNavigation .mapboxgl-ctrl-top-right, .TomTomNavigation .mapboxgl-ctrl-top-left {
          margin-top: ${marginTop}px;
        }`
      );
    }
    return () => removeStyleFromDocument(styleId);
  }, [isPhone, position, top]);
};

const styleId = "search-ctrl-margin-adjustment";

const Search = ({ position }) => {
  const {
    isPhone,
    isTablet,
    safeAreaInsets: { top }
  } = useAppContext();
  const theme = useTheme();
  const resolvedPosition = position || (isPhone ? "bottom" : "top");
  const classes = useSearchStyles({
    position: resolvedPosition,
    top,
    isPhone,
    isTablet
  });

  useSafeAreaAdjustments(isPhone, resolvedPosition, top);

  return (
    <div className={`Search ${classes}`}>
      <Stack tokens={{ childrenGap: theme.spacing.m }} horizontal={false}>
        <SearchBox />
        <POIStrip />
      </Stack>
    </div>
  );
};

export default Search;
