import React from "react";
import { makeStyles, useTheme } from "@fluentui/react";
import SearchIcon from "../../icons/SearchIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.s1,
    color: theme.semanticColors.inputPlaceholderText,
    backgroundColor: theme.semanticColors.inputBackground,
    padding: "12px 16px",
    width: "100%",
    height: 56,
    // border: `2px solid color-mix(in srgb, ${theme.palette.black}, transparent 85%)`,
    borderRadius: 100,
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 500
  }
}));

const SearchBox = ({ placeholder = "Where to?" }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SearchIcon color={theme.semanticColors.inputIcon} size={28} />
      {placeholder}
    </div>
  );
};

export default SearchBox;
