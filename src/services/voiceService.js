// Voice service using Web Speech API for TTS and recognition

class VoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    
    // Initialize Speech Recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  // Text to Speech
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Start listening for voice commands
  startListening(onResult, onError) {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      if (onError) onError(new Error('Speech recognition not supported'));
      return;
    }

    this.recognition.onstart = () => {
      console.log('[VoiceService] ✅ Recognition started/restarted');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      const confidence = event.results[event.results.length - 1][0].confidence;
      console.log(`[VoiceService] 🎤 Recognized: "${transcript}" (confidence: ${(confidence * 100).toFixed(1)}%)`);
      onResult(transcript);
    };

    this.recognition.onerror = (error) => {
      console.error('[VoiceService] Speech recognition error:', error);
      // Don't restart on 'no-speech' errors
      if (error.error === 'no-speech') {
        console.log('[VoiceService] No speech detected, continuing...');
      } else if (onError) {
        onError(error);
      }
    };

    this.recognition.onend = () => {
      console.log('[VoiceService] Recognition ended, isListening:', this.isListening);
      // Automatically restart if still in listening mode
      if (this.isListening) {
        console.log('[VoiceService] Restarting recognition...');
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (e) {
            console.error('[VoiceService] Error restarting recognition:', e);
            // If already started, that's okay
            if (e.message && e.message.includes('already started')) {
              console.log('[VoiceService] Recognition already running');
            }
          }
        }, 100);
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      console.log('[VoiceService] Speech recognition started');
    } catch (e) {
      console.error('[VoiceService] Error starting recognition:', e);
      if (e.message && e.message.includes('already started')) {
        console.log('[VoiceService] Recognition already running, continuing...');
        this.isListening = true;
      }
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }

  // Check if voice is available
  isAvailable() {
    return !!(this.synthesis && this.recognition);
  }
}

export default new VoiceService();

