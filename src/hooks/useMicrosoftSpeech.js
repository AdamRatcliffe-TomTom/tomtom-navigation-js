import { useState, useEffect, useCallback } from "react";

import {
  MS_SPEECH_SERVICE_REGION,
  MS_SPEECH_SERVICE_SUBSCRIPTION_KEY
} from "../config";

const defaultVoiceName = "en-US-JennyNeural";
const audioSupported = typeof Audio !== "undefined";

let activePlayer;
let isSpeaking;
let isCancelled;

const useMicrosoftSpeech = () => {
  const [voices, setVoices] = useState();
  const [voicesAvailable, setVoicesAvailable] = useState(false);

  useEffect(() => {
    getAvailableVoices();
  }, []);

  const getAvailableVoices = async () => {
    const url = `https://${MS_SPEECH_SERVICE_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": MS_SPEECH_SERVICE_SUBSCRIPTION_KEY,
        "Content-Type": "application/json"
      }
    });
    const voices = await response.json();

    setVoices(voices);
    setVoicesAvailable(true);
  };

  const getDefaultVoice = useCallback(() => {
    if (voicesAvailable) {
      return voices.find((voice) => voice.ShortName === defaultVoiceName);
    }
    return null;
  }, [voicesAvailable, voices]);

  const getVoiceForLanguage = useCallback(
    (lang) => {
      if (voicesAvailable) {
        const exactMatch = voices.find((voice) => voice.Locale === lang);

        if (exactMatch) {
          return exactMatch;
        }

        const languageMatch = voices.find((voice) =>
          voice.Locale.startsWith(lang + "-")
        );

        return languageMatch || getDefaultVoice();
      } else {
        return null;
      }
    },
    [voicesAvailable, voices, getDefaultVoice]
  );

  const getVoiceByName = useCallback(
    (name) => {
      if (voicesAvailable) {
        return voices.find((voice) => voice.ShortName === name);
      }
      return null;
    },
    [voicesAvailable, voices]
  );

  const speak = ({ text, voice, volume = 0.5, playbackRate = 1 }) => {
    if (isSpeaking) {
      return;
    }
    isSpeaking = true;
    isCancelled = false;

    const voiceName =
      (typeof voice === "object" ? voice.ShortName : voice) ||
      getDefaultVoice()?.ShortName;

    const url = `https://${MS_SPEECH_SERVICE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": MS_SPEECH_SERVICE_SUBSCRIPTION_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
      },
      body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
               <voice name="${voiceName}">
                 ${text}
               </voice>
             </speak>`
    })
      .then((response) => response.arrayBuffer())
      .then((audioData) => {
        if (isCancelled) {
          return;
        }

        activePlayer = new Audio();
        activePlayer.src = URL.createObjectURL(
          new Blob([audioData], { type: "audio/mp3" })
        );
        activePlayer.playbackRate = playbackRate;
        activePlayer.volume = volume;
        activePlayer.addEventListener("ended", () => {
          activePlayer = null;
          isSpeaking = false;
        });
        activePlayer.play();
      })
      .catch((error) => {
        console.error("Speech synthesis failed: " + error);
      });
  };

  // API has no method for canceling any existing utterance. Achieve that
  // by pausing and closing the active player
  const cancelSpeech = () => {
    if (activePlayer) {
      activePlayer.pause();
      activePlayer = null;
      isSpeaking = false;
    } else {
      isCancelled = true;
    }
  };

  return {
    speechAvailable: audioSupported,
    voicesAvailable,
    voices,
    speak,
    cancelSpeech,
    getDefaultVoice,
    getVoiceByName,
    getVoiceForLanguage
  };
};

export default useMicrosoftSpeech;
