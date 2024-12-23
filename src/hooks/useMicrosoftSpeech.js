import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import JSZip from "jszip";
import {
  MS_SPEECH_SERVICE_REGION,
  MS_SPEECH_SERVICE_SUBSCRIPTION_KEY
} from "../config";

const audioCache = new Map();
const queue = [];
let lastRouteHash = null;

const defaultVoiceName = "en-US-JennyNeural";
const audioSupported = typeof Audio !== "undefined";

let activePlayer = null;
let isSpeaking = false;

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

  const createBatchRequest = useCallback(async (texts, voiceName) => {
    const jobId = `batch-synthesis-${uuid()}`;
    const url = `https://${MS_SPEECH_SERVICE_REGION}.api.cognitive.microsoft.com/texttospeech/batchsyntheses/${jobId}?api-version=2024-04-01`;

    const inputs = texts.map((text) => ({
      content: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
                  <voice name="${voiceName}">${text}</voice>
                </speak>`
    }));

    const payload = {
      inputKind: "SSML",
      inputs: inputs,
      properties: {
        outputFormat: "riff-24khz-16bit-mono-pcm",
        timeToLiveInHours: 744
      }
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Ocp-Apim-Subscription-Key": MS_SPEECH_SERVICE_SUBSCRIPTION_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Batch synthesis request failed: ${response.statusText}`);
    }

    return jobId;
  }, []);

  const pollBatchStatus = useCallback(async (jobId) => {
    const url = `https://${MS_SPEECH_SERVICE_REGION}.api.cognitive.microsoft.com/texttospeech/batchsyntheses/${jobId}?api-version=2024-04-01`;

    while (true) {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": MS_SPEECH_SERVICE_SUBSCRIPTION_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get batch status: ${response.statusText}`);
      }

      const data = await response.json();
      const status = data.status;

      if (status === "Succeeded") {
        return data.outputs.result;
      } else if (status === "Failed") {
        throw new Error("Batch synthesis failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, []);

  const fetchAndExtractZip = useCallback(async (zipUrl, texts) => {
    const response = await fetch(zipUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch results ZIP: ${response.statusText}`);
    }

    const zipData = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);

    const audioMap = new Map();
    const audioPromises = texts.map(async (text, index) => {
      const fileIndex = String(index + 1).padStart(4, "0");
      const wavFile = zip.file(`${fileIndex}.wav`);
      if (wavFile) {
        const audioBlob = await wavFile.async("blob");
        audioMap.set(text, new Blob([audioBlob], { type: "audio/wav" }));
      }
    });

    await Promise.all(audioPromises);
    return audioMap;
  }, []);

  const prefetchAudio = useCallback(
    async (texts, routeHash, voiceName) => {
      if (routeHash === lastRouteHash) {
        console.log("Using cached audio for route");
        return;
      }

      console.log("Fetching audio for route");

      audioCache.clear();
      lastRouteHash = routeHash;

      const selectedVoiceName = voiceName || getDefaultVoice()?.ShortName;
      if (!selectedVoiceName) {
        throw new Error(
          "No voice name provided and no default voice available."
        );
      }

      try {
        const jobId = await createBatchRequest(texts, selectedVoiceName);
        const zipUrl = await pollBatchStatus(jobId);
        const audioMap = await fetchAndExtractZip(zipUrl, texts);

        for (const [text, audioBlob] of audioMap.entries()) {
          console.log(`Adding audio for text "${text}"`);

          audioCache.set(text, audioBlob);
        }
        console.log("Fetched audio for route");
      } catch (error) {
        console.error("Batch audio prefetch failed:", error);
      }
    },
    [getDefaultVoice, createBatchRequest, pollBatchStatus, fetchAndExtractZip]
  );

  const fetchSingleAudio = async ({ text, voiceName }) => {
    const url = `https://${MS_SPEECH_SERVICE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const response = await fetch(url, {
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
    });

    if (!response.ok) {
      throw new Error(`Text-to-speech request failed: ${response.statusText}`);
    }

    return await response.blob();
  };

  const playNextInQueue = () => {
    if (queue.length > 0) {
      const next = queue.shift();
      speak(next);
    }
  };

  const speak = async ({
    text,
    volume = 1,
    playbackRate = 1,
    replace = false,
    enqueue = false
  }) => {
    if (isSpeaking && enqueue) {
      console.log(`Text enqueued: "${text}"`);
      queue.push({ text, volume, playbackRate });
      return;
    }

    if (isSpeaking && replace) {
      console.log("Replacing current utterance with a new one.");
      cancelSpeech();
    }

    if (isSpeaking) {
      console.log("Already speaking, cannot play a new text.");
      return;
    }

    isSpeaking = true;

    let audioBlob = audioCache.get(text);

    if (!audioBlob) {
      console.log(`Text not found in cache "${text}", fetching dynamically...`);
      try {
        const voiceName = getDefaultVoice()?.ShortName;
        audioBlob = await fetchSingleAudio({ text, voiceName });
        audioCache.set(text, audioBlob);
      } catch (error) {
        console.error("Dynamic text-to-speech failed:", error);
        isSpeaking = false;
        return;
      }
    } else {
      console.log("Text found in cache");
    }

    activePlayer = new Audio(URL.createObjectURL(audioBlob));
    activePlayer.volume = volume;
    activePlayer.playbackRate = playbackRate;
    activePlayer.addEventListener("ended", () => {
      activePlayer = null;
      isSpeaking = false;
      playNextInQueue();
    });
    activePlayer.play();
  };

  const cancelSpeech = () => {
    if (activePlayer) {
      activePlayer.pause();
      activePlayer = null;
      isSpeaking = false;
      queue.length = 0;
      console.log("Speech cancelled.");
    }
  };

  return {
    speechAvailable: audioSupported,
    voicesAvailable,
    voices,
    speak,
    prefetchAudio,
    cancelSpeech,
    getDefaultVoice,
    getVoiceByName,
    getVoiceForLanguage
  };
};

export default useMicrosoftSpeech;
