import React from "react";
import { useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import useSpeech from "../../../hooks/useMicrosoftSpeech";
import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import MuteIcon from "../../../icons/MuteIcon";
import UnmuteIcon from "../../../icons/UnmuteIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";

const Mute = ({ visible, voiceAnnouncementsEnabled, onClick = () => {} }) => {
  const theme = useTheme();
  const { cancelSpeech } = useSpeech();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    const enabled = !voiceAnnouncementsEnabled;

    if (!enabled) {
      cancelSpeech();
    }

    onClick(enabled);
  };

  const Icon = voiceAnnouncementsEnabled ? UnmuteIcon : MuteIcon;

  return (
    <Fade show={visible} duration="0.15s">
      <div className={buttonClasses.mapControlButton} onClick={handleClick}>
        <Icon color={theme.palette.black} size={32} />
      </div>
    </Fade>
  );
};

const MuteControl = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <Mute {...otherProps} />
  </MapControl>
);

export default withMap(MuteControl);
