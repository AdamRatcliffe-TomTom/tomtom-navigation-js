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

const defaultVoiceName = "en-US-JennyNeural";
const audioSupported = typeof Audio !== "undefined";

const useMicrosoftSpeech = () => {
  const [voices, setVoices] = useState();
  const [voicesAvailable, setVoicesAvailable] = useState(false);
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
      setVoicesAvailable(true);
    };
    fetchVoices();
  }, []);

  const getDefaultVoice = () => {
    if (voicesAvailable) {
      return voices.find((voice) => voice.privShortName === defaultVoiceName);
    }
    return null;
  };

  const getVoiceForLanguage = (lang) => {
    if (voicesAvailable) {
      const exactMatch = voices.find((voice) => voice.privLocale === lang);

      if (exactMatch) {
        return exactMatch;
      }

      const languageMatch = voices.find((voice) =>
        voice.privLocale.startsWith(lang + "-")
      );

      return languageMatch || getDefaultVoice();
    } else {
      return null;
    }
  };

  const getVoiceByName = (name) => {
    if (voicesAvailable) {
      return voices.find((voice) => voice.privShortName === name);
    }
    return null;
  };

  const speak = ({ text, voice, volume = 1 }) => {
    if (voicesAvailable) {
      // API has no method for canceling any existing utterance. Achieve that
      // by pausing and closing the active player
      if (activePlayer) {
        activePlayer.pause();
        activePlayer.close();
      }

      const player = new SpeakerAudioDestination();
      player.volume = volume;
      setActivePlayer(player);

      const speechConfig = getSpeechConfig();
      const voiceName =
        (typeof voice === "object" ? voice.privShortName : voice) ||
        getDefaultVoice()?.privShortName;

      speechConfig.speechSynthesisVoiceName = voiceName;

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
    }
  };

  return {
    speechAvailable: audioSupported,
    voicesAvailable,
    voices,
    speak,
    getDefaultVoice,
    getVoiceByName,
    getVoiceForLanguage
  };
};

export default useMicrosoftSpeech;
