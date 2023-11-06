import { useState, useEffect } from "react";

import {
  SpeechConfig,
  SpeechSynthesizer,
  SpeakerAudioDestination,
  AudioConfig
} from "microsoft-cognitiveservices-speech-sdk";

import {
  MS_SPEECH_SERVICE_REGION,
  MS_SPEECH_SERVICE_SUBSCRIPTION_KEY
} from "../config";

const useMicrosoftSpeech = () => {
  const [voices, setVoices] = useState();
  const [activePlayer, setActivePlayer] = useState();

  const getSpeechConfig = () =>
    SpeechConfig.fromSubscription(
      MS_SPEECH_SERVICE_SUBSCRIPTION_KEY,
      MS_SPEECH_SERVICE_REGION
    );

  useEffect(() => {
    const fetchVoices = async () => {
      const speechConfig = getSpeechConfig();
      const speechSynthesizer = new SpeechSynthesizer(speechConfig);
      const voices = await speechSynthesizer.getVoicesAsync();
      setVoices(voices.privVoices);
    };
    fetchVoices();
  }, []);

  const getVoiceForLanguage = (lang) => {
    const exactMatch = voices.find((voice) => voice.privLocale === lang);

    if (exactMatch) {
      return exactMatch.privShortName;
    }

    const languageMatch = voices.find((voice) =>
      voice.privLocale.startsWith(lang + "-")
    );

    return languageMatch.privShortName || voices[0].privShortName;
  };

  const speak = ({ text, voice = "en-US-JennyNeural" }) => {
    if (activePlayer) {
      activePlayer.pause();
    }

    const player = new SpeakerAudioDestination();
    setActivePlayer(player);

    const speechConfig = getSpeechConfig();
    speechConfig.speechSynthesisVoiceName = voice;

    const audioConfig = AudioConfig.fromSpeakerOutput(player);

    const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    speechSynthesizer.speakTextAsync(text);
  };

  return {
    getVoiceForLanguage,
    speak
  };
};

export default useMicrosoftSpeech;
