// Web Speech API Service for Text-To-Speech (TTS) and Speech-To-Text (STT)

export interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Text-to-Speech (TTS) function
 */
export const speakText = (
  text: string,
  voiceGender: 'male' | 'female' = 'male',
  rate: number = 1.0,
  onEnd?: () => void
): boolean => {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';

  // Get available voices
  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (voiceGender === 'male') {
      // Look for male US/UK voice
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('David') ||
            v.name.includes('George') ||
            v.name.includes('Male') ||
            v.name.includes('Google US English'))
      );
    } else {
      // Look for female US/UK voice
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Zira') ||
            v.name.includes('Susan') ||
            v.name.includes('Female') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Samantha'))
      );
    }

    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  if (onEnd) {
    utterance.onend = () => {
      activeUtterance = null;
      onEnd();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      onEnd();
    };
  }

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
};

/**
 * Stop any active TTS playback
 */
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};

/**
 * Check if Speech Recognition is supported by the browser
 */
export const isSTTSupported = (): boolean => {
  const win = window as SpeechRecognitionWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
};

/**
 * Request microphone permission via getUserMedia to prevent Chrome network socket error
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return true;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after granting permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission denied or unavailable:', err);
    return false;
  }
};

let currentRecognition: any = null;
let networkRetryCount = 0;

/**
 * Start listening via Web Speech API (STT) with permission pre-check & network retry
 */
export const startListening = (
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): boolean => {
  const win = window as SpeechRecognitionWindow;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    if (onError) onError('Trình duyệt của bạn không hỗ trợ Web Speech Recognition (STT). Hãy dùng Chrome/Edge.');
    return false;
  }

  // Pre-request getUserMedia to initialize hardware mic stream
  requestMicrophonePermission().then((hasPermission) => {
    if (!hasPermission && onError) {
      onError('Quyền truy cập Microphone bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
      return;
    }

    try {
      if (currentRecognition) {
        try { currentRecognition.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        networkRetryCount = 0; // reset retry on successful result
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'network') {
          if (networkRetryCount < 1) {
            networkRetryCount++;
            console.log('Retrying SpeechRecognition due to network glitch...');
            setTimeout(() => {
              try { recognition.start(); } catch (e) {}
            }, 400);
            return;
          }
          if (onError) {
            onError('Không thể kết nối dịch vụ giọng nói Google (Lỗi network). Vui lòng kiểm tra lại kết nối mạng hoặc thử gõ phím.');
          }
        } else if (event.error === 'not-allowed') {
          if (onError) onError('Quyền truy cập Microphone bị từ chối. Vui lòng kiểm tra cài đặt Chrome.');
        } else if (event.error === 'no-speech') {
          if (onError) onError('Không nghe thấy âm thanh. Vui lòng thử nói lại!');
        } else {
          if (onError) onError(`Lỗi mic: ${event.error}`);
        }
      };

      recognition.onend = () => {
        currentRecognition = null;
        if (onEnd) onEnd();
      };

      currentRecognition = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      if (onError) onError(err.message || 'Không thể bắt đầu thu âm.');
    }
  });

  return true;
};

/**
 * Stop active speech recognition
 */
export const stopListening = (): void => {
  networkRetryCount = 0;
  if (currentRecognition) {
    try { currentRecognition.stop(); } catch (e) {}
    currentRecognition = null;
  }
};
