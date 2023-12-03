import React from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton
} from "@fluentui/react";

import strings from "../config/strings";

const GeolocationDialog = ({
  isGeolocationAvailable,
  isGeolocationEnabled,
  hidden,
  onToggleHide = () => {}
}) => {
  const message = !isGeolocationAvailable
    ? strings.locationServicesUnavailable
    : !isGeolocationEnabled
    ? strings.locationServicesNotEnabled
    : "";

  return (
    <Dialog
      modalProps={{
        isBlocking: false
      }}
      dialogContentProps={{
        type: DialogType.normal,
        title: strings.location,
        subText: message
      }}
      onDismiss={onToggleHide}
      hidden={hidden}
    >
      <DialogFooter>
        <PrimaryButton onClick={onToggleHide}>{strings.ok}</PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};

export default GeolocationDialog;
