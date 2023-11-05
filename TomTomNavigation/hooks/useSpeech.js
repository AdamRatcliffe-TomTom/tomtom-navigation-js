import { useEffect, useState } from "react";

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

  const getDefaultVoice = () => {
    if (voicesAvailable) {
      return voices.find((voice) => voice.default);
    }
    return null;
  };

  const getVoiceForLanguage = (lang) => {
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
  };

  const speak = ({ text, voice, volume = 1 }) => {
    if (voicesAvailable) {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice || getDefaultVoice();
      utterance.volume = volume;

      synth.speak(utterance);
    }
  };

  return {
    speechAvailable: Boolean(synth),
    voicesAvailable,
    synth,
    voices,
    speak,
    getVoiceForLanguage,
    getDefaultVoice
  };
};

export default useSpeech;
