import { speakText, startListening } from '../services/speechService';

export const playTtsSpeech = (text: string, lang: string = 'en-US'): void => {
  speakText(text, 'female', 0.9);
};

export const startSpeechRecognition = (
  onResult: (transcript: string) => void,
  onError?: (error: string) => void
): void => {
  startListening(onResult, onError);
};
