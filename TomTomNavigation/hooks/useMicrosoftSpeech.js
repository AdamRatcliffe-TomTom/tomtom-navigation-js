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

const defaultVoice = "en-US-JennyNeural";

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

    return languageMatch?.privShortName || defaultVoice;
  };

  const speak = ({ text, voice = defaultVoice }) => {
    // API has no method for canceling any existing utterance. Achieve that
    // by pausing and closing the active player
    if (activePlayer) {
      activePlayer.pause();
      activePlayer.close();
    }

    const player = new SpeakerAudioDestination();
    setActivePlayer(player);

    const speechConfig = getSpeechConfig();
    speechConfig.speechSynthesisVoiceName = voice;

    const audioConfig = AudioConfig.fromSpeakerOutput(player);

    let speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    speechSynthesizer.speakTextAsync(
      text,
      () => {
        speechSynthesizer.close();
        speechSynthesizer = undefined;
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        speechSynthesizer = undefined;
      }
    );
  };

  return {
    getVoiceForLanguage,
    speak
  };
};

export default useMicrosoftSpeech;
