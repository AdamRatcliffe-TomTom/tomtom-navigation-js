import { useEffect } from "react";
import { useNavigationContext } from "../../../core/NavigationContext";
import useSpeech from "../../../hooks/useMicrosoftSpeech";
import { allAnnouncements } from "../../../functions/routeUtils";

const usePrefetchAudio = ({
  routeFeature,
  speechAvailable,
  voicesAvailable,
  voice,
  isPedestrian
}) => {
  const { language, measurementSystem } = useNavigationContext();
  const { prefetchAudio } = useSpeech();

  useEffect(() => {
    if (routeFeature) {
      const shouldPrefetchAudio = speechAvailable && voicesAvailable;

      if (shouldPrefetchAudio) {
        let messages = [];

        if (isPedestrian) {
          const {
            properties: {
              guidance: { instructions }
            }
          } = routeFeature;
          messages = instructions.map((instruction) => instruction.message);
        } else {
          const announcements = allAnnouncements(
            routeFeature,
            measurementSystem,
            language,
            false
          );
          messages = announcements.map((announcement) => announcement.text);
        }

        prefetchAudio(messages, JSON.stringify(messages), voice);
      }
    }
  }, [
    routeFeature,
    speechAvailable,
    voicesAvailable,
    voice,
    isPedestrian,
    prefetchAudio
  ]);
};

export default usePrefetchAudio;
