import React from "react";

import RoadworkIcon from "../icons/RoadworkIcon";
import RoadworkMinorIcon from "../icons/RoadworkMinorIcon";
import RoadworkModerateIcon from "../icons/RoadworkModerateIcon";
import RoadworkMajorIcon from "../icons/RoadworkMajorIcon";
import TrafficIcon from "../icons/TrafficIcon";
import TrafficMinorIcon from "../icons/TrafficMinorIcon";
import TrafficModerateIcon from "../icons/TrafficModerateIcon";
import TrafficMajorIcon from "../icons/TrafficMajorIcon";

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
      break;
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
    default:
      break;
  }
}
