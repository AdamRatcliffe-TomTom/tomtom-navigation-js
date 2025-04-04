import { useEffect, useState, useCallback } from "react";

const useSpeech = () => {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState(synth.getVoices());
  const [voicesAvailable, setVoicesAvailable] = useState(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(synth.getVoices());
      setVoicesAvailable(true);
    };

    if (voices.length) {
      setVoicesAvailable(true);
    } else {
      synth.addEventListener("voiceschanged", handleVoicesChanged);
    }

    return () =>
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
  }, []);

  const getDefaultVoice = useCallback(() => {
    if (voicesAvailable) {
      return voices.find((voice) => voice.default);
    }
    return null;
  }, [voicesAvailable, voices]);

  const getVoiceForLanguage = useCallback(
    (lang) => {
      if (voicesAvailable) {
        const exactMatch = voices.find((voice) => voice.lang === lang);

        if (exactMatch) {
          return exactMatch;
        }

        const languageMatch = voices.find((voice) =>
          voice.lang.startsWith(lang + "-")
        );

        return languageMatch || voices[0];
      }
      return null;
    },
    [voicesAvailable, voices]
  );

  const getVoiceByName = useCallback(
    (name) => {
      if (voicesAvailable) {
        return voices.find((voice) => voice.name === name);
      }
      return null;
    },
    [voicesAvailable, voices]
  );

  const speak = ({ text, voice, volume = 1, playbackRate = 1 }) => {
    if (voicesAvailable) {
      if (synth.speaking) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const voiceObject = voice
        ? typeof voice === "string"
          ? getVoiceByName(voice)
          : voice
        : getDefaultVoice();
      utterance.voice = voiceObject;
      utterance.volume = volume;
      utterance.rate = playbackRate;
      utterance.onerror = (error) => {
        console.error("Speech synthesis error: ", error);
      };

      synth.speak(utterance);
    }
  };

  const cancelSpeech = () => {
    synth.cancel();
  };

  return {
    speechAvailable: Boolean(synth),
    voicesAvailable,
    synth,
    voices,
    speak,
    cancelSpeech,
    getDefaultVoice,
    getVoiceByName,
    getVoiceForLanguage
  };
};

export default useSpeech;
