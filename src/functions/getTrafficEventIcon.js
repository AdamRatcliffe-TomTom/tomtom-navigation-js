import React from "react";

import RoadworkIcon from "../icons/RoadworkIcon";
import RoadworkMinorIcon from "../icons/RoadworkMinorIcon";
import RoadworkModerateIcon from "../icons/RoadworkModerateIcon";
import RoadworkMajorIcon from "../icons/RoadworkMajorIcon";
import TrafficIcon from "../icons/TrafficIcon";
import TrafficMinorIcon from "../icons/TrafficMinorIcon";
import TrafficModerateIcon from "../icons/TrafficModerateIcon";
import TrafficMajorIcon from "../icons/TrafficMajorIcon";
import RoadClosedIcon from "../icons/RoadClosedIcon";
import TrafficOtherIcon from "../icons/TrafficOtherIcon";
import TrafficOtherMinorIcon from "../icons/TrafficOtherMinorIcon";
import TrafficOtherModerateIcon from "../icons/TrafficOtherModerateIcon";
import TrafficOtherMajorIcon from "../icons/TrafficOtherMajorIcon";

export default function getTrafficEventIcon(event) {
  const { simpleCategory, magnitudeOfDelay } = event;

  switch (simpleCategory) {
    case "ROAD_WORK":
      switch (magnitudeOfDelay) {
        case 1:
          return <RoadworkMinorIcon size={48} />;
        case 2:
          return <RoadworkModerateIcon size={48} />;
        case 3:
          return <RoadworkMajorIcon size={48} />;
        default:
          return <RoadworkIcon size={48} />;
      }
    case "ROAD_CLOSURE":
      return <RoadClosedIcon size={48} />;
    case "JAM":
      switch (magnitudeOfDelay) {
        case 1:
          return <TrafficMinorIcon size={48} />;
        case 2:
          return <TrafficModerateIcon size={48} />;
        case 3:
          return <TrafficMajorIcon size={48} />;
        default:
          return <TrafficIcon size={48} />;
      }
    case "OTHER":
      switch (magnitudeOfDelay) {
        case 1:
          return <TrafficOtherMinorIcon size={48} />;
        case 2:
          return <TrafficOtherModerateIcon size={48} />;
        case 3:
          return <TrafficOtherMajorIcon size={48} />;
        default:
          return <TrafficOtherIcon size={48} />;
      }
    default:
      return null;
  }
}
