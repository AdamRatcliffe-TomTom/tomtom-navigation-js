import React, { useState } from "react";
import { useTheme, makeStyles, Modal, IconButton } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import LayersIcon from "../../icons/LayersIcon";
import Fade from "../../components/Fade";
import useButtonStyles from "../../hooks/useButtonStyles";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "auto"
  },
  closeButton: {
    color: theme.palette.neutralSecondary,
    position: "absolute",
    top: 4,
    right: 4,
    ":hover": {
      background: "none"
    },
    ":active": {
      background: "none"
    }
  }
}));

const MapStylesModal = ({ onDismiss, ...otherProps }) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      modalProps={{
        isBlocking: false
      }}
      onDismiss={onDismiss}
      {...otherProps}
    >
      <div>
        <IconButton
          className={classes.closeButton}
          iconProps={{ iconName: "Cancel" }}
          onClick={onDismiss}
        />
      </div>
    </Modal>
  );
};

const MapSwitcher = ({ hostId, visible = true }) => {
  const theme = useTheme();
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
          hostId
        }}
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
