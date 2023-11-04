import React from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import useSpeech from "../../hooks/useSpeech";
import Fade from "../../components/Fade";
import MapControl from "./MapControl";
import MuteIcon from "../../icons/MuteIcon";
import UnmuteIcon from "../../icons/UnmuteIcon";
import useButtonStyles from "../../hooks/useButtonStyles";

import { setVoiceAnnouncementsEnabled } from "../navigation/navigationSlice";

const Mute = ({ visible, voiceAnnouncementsEnabled }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { synth } = useSpeech();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    const enabled = !voiceAnnouncementsEnabled;

    if (!enabled) {
      synth.cancel();
    }

    dispatch(setVoiceAnnouncementsEnabled(enabled));
  };

  const Icon = voiceAnnouncementsEnabled ? UnmuteIcon : MuteIcon;

  return (
    <Fade show={visible} duration="0.3s">
      <div className={buttonClasses.mapControlButton} onClick={handleClick}>
        <Icon color={theme.palette.black} />
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
