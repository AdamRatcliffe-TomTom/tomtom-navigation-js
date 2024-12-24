import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import JSZip from "jszip";
import {
  MS_SPEECH_SERVICE_REGION,
  MS_SPEECH_SERVICE_SUBSCRIPTION_KEY
} from "../config";

const audioCache = new Map();
const queue = [];

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
    async (texts, voiceName) => {
      if (!voiceName) {
        throw new Error("Voice name is required for prefetching audio.");
      }

      // Initialize cache for the given voice if it doesn't exist
      if (!audioCache.has(voiceName)) {
        audioCache.set(voiceName, new Map());
      }
      const voiceCache = audioCache.get(voiceName);

      // Filter texts to only those not already in the cache
      const missingTexts = texts.filter((text) => !voiceCache.has(text));
      if (missingTexts.length === 0) {
        console.log(`All texts already cached for voice: ${voiceName}`);
        return;
      }

      console.log(
        `Fetching audio for missing texts: ${missingTexts.join(", ")}`
      );

      try {
        const jobId = await createBatchRequest(missingTexts, voiceName);
        const zipUrl = await pollBatchStatus(jobId);
        const audioMap = await fetchAndExtractZip(zipUrl, missingTexts);

        // Add fetched audio to the cache
        for (const [text, audioBlob] of audioMap.entries()) {
          console.log(
            `Adding audio to cache for voice: "${voiceName}", text: "${text}"`
          );
          voiceCache.set(text, audioBlob);
        }
      } catch (error) {
        console.error("Batch audio prefetch failed:", error);
      }
    },
    [createBatchRequest, pollBatchStatus, fetchAndExtractZip]
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
    voice,
    volume = 1,
    playbackRate = 1,
    replace = false,
    enqueue = false
  }) => {
    const voiceName =
      (typeof voice === "object" ? voice.ShortName : voice) ||
      getDefaultVoice()?.ShortName;

    if (!voiceName) {
      console.error("Voice name is required to play audio.");
      return;
    }

    // Ensure the cache exists for this voice
    if (!audioCache.has(voiceName)) {
      audioCache.set(voiceName, new Map());
    }
    const voiceCache = audioCache.get(voiceName);

    // Check if audio exists in cache
    let audioBlob = voiceCache.get(text);
    if (!audioBlob) {
      console.log(
        `Text "${text}" not found in cache for voice "${voiceName}", fetching dynamically...`
      );
      try {
        audioBlob = await fetchSingleAudio({ text, voiceName });
        voiceCache.set(text, audioBlob); // Add to cache after fetching
      } catch (error) {
        console.error(
          `Failed to fetch audio for text: "${text}", voice: "${voiceName}". Error:`,
          error
        );
        return;
      }
    }

    console.log(`Playing audio for text: "${text}", voice: "${voiceName}"`);

    if (isSpeaking && enqueue) {
      console.log(`Text enqueued: "${text}"`);
      queue.push({ text, voice, volume, playbackRate });
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
