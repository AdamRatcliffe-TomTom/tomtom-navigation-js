import React from "react";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing.m,
    boxShadow: theme.floatingElementShadow,
    zIndex: 0
  },
  item: {
    position: "relative",
    padding: theme.spacing.l1,
    borderBottomLeftRadius: theme.spacing.m,
    borderBottomRightRadius: theme.spacing.m,
    "&:first-child": {
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m
    },
    "&:not(:first-child)": {
      paddingTop: parseInt(theme.spacing.l1) + parseInt(theme.spacing.m),
      marginTop: parseInt(theme.spacing.m) * -1
    }
  }
}));

const Item = ({ className, children, zIndex, ...otherProps }) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.item} ${className}`}
      style={{ zIndex }}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const Stack = React.forwardRef(
  ({ className, children, ...otherProps }, ref) => {
    const classes = useStyles();

    const renderItems = () =>
      React.Children.toArray(children)
        .filter(Boolean)
        .map((item, index) =>
          React.cloneElement(item, {
            key: index,
            zIndex: index * -1
          })
        );

    return (
      <div
        ref={ref}
        className={`${className} ${classes.root} `}
        {...otherProps}
      >
        {renderItems()}
      </div>
    );
  }
);

Stack.Item = Item;

export default Stack;
