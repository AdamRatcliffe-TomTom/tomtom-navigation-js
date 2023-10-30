import React, { useState, useMemo } from "react";
import {
  useTheme,
  makeStyles,
  Modal,
  Stack,
  IconButton,
  Text
} from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import LayersIcon from "../../icons/LayersIcon";
import Fade from "../../components/Fade";
import { useAppContext } from "../../app/AppContext";
import useButtonStyles from "../../hooks/useButtonStyles";
import strings from "../../config/strings";

const useStyles = (props) =>
  makeStyles((theme) => ({
    modal: {
      position: "auto",
      minHeight: 100
    },
    title: {
      padding: `${theme.spacing.s2} ${theme.spacing.s2} ${theme.spacing.s2} ${theme.spacing.m}`
    },
    items: {
      padding: `${theme.spacing.s2} ${theme.spacing.m} ${theme.spacing.m}`
    },
    closeButton: {
      color: theme.palette.neutralSecondary,
      ":hover": {
        background: "none"
      },
      ":active": {
        background: "none"
      }
    },
    item: {
      display: "flex",
      flexDirection: "column"
    },
    itemMap: {
      width: 120,
      height: 100,
      borderStyle: "solid",
      borderRadius: 8,
      borderWidth: 3,
      borderColor: props?.selected ? theme.palette.themePrimary : "transparent",
      cursor: "pointer",
      transition: "border 0.3s"
    },
    itemLabel: {
      textAlign: "center",
      marginTop: theme.spacing.s1
    }
  }));

const MapItem = ({ mapStyle, selected, onSelected }) => {
  const classes = useStyles({ selected })();
  const { name, label } = mapStyle;

  const handleClick = () => {
    onSelected(name);
  };

  return (
    <Stack.Item className={classes.item} onClick={handleClick}>
      <div className={classes.itemMap}></div>
      <Text className={classes.itemLabel} variant="mediumPlus">
        {label}
      </Text>
    </Stack.Item>
  );
};

const MapStylesModal = ({ selected, onSelected, onDismiss, ...otherProps }) => {
  const theme = useTheme();
  const classes = useStyles()();
  const { mapStyles } = useAppContext();

  const items = useMemo(
    () =>
      Object.keys(mapStyles).map((name) => {
        const mapStyle = mapStyles[name];
        return (
          <MapItem
            key={name}
            mapStyle={mapStyle}
            selected={name === selected}
            onSelected={onSelected}
          />
        );
      }),
    [mapStyles, selected]
  );

  return (
    <Modal
      className={classes.modal}
      modalProps={{
        isBlocking: false
      }}
      onDismiss={onDismiss}
      {...otherProps}
    >
      <Stack
        className={classes.title}
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <Text variant="large">{strings.chooseMap}</Text>
        <IconButton
          className={classes.closeButton}
          iconProps={{ iconName: "Cancel" }}
          onClick={onDismiss}
        />
      </Stack>
      <div className={classes.items}>
        <Stack tokens={{ childrenGap: theme.spacing.m }} horizontal>
          {items}
        </Stack>
      </div>
    </Modal>
  );
};

const MapSwitcher = ({
  selected = "street",
  onSelected = () => {},
  visible = true
}) => {
  const theme = useTheme();
  const { layerHostId } = useAppContext();
  const buttonStyles = useButtonStyles();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showModal = () => {
    setModalIsOpen(true);
  };

  const hideModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Fade show={visible} duration="0.3s">
        <div className={buttonStyles.mapControlButton} onClick={showModal}>
          <LayersIcon color={theme.palette.black} />
        </div>
      </Fade>
      <MapStylesModal
        isOpen={modalIsOpen}
        onDismiss={hideModal}
        layerProps={{
          styles: {
            position: "absolute"
          },
          hostId: layerHostId
        }}
        selected={selected}
        onSelected={onSelected}
      />
    </>
  );
};

const MapSwitcherControlAlt = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <MapSwitcher {...otherProps} />
  </MapControl>
);

export default withMap(MapSwitcherControlAlt);
