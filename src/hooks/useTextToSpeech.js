import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isActivated, setIsActivated] = useState(false);
    const utteranceRef = useRef(null);
    const voicesLoadedRef = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setIsSupported(true);

            // Load voices - needed for some browsers
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    voicesLoadedRef.current = true;
                    console.log('Voices loaded:', voices.length);
                }
            };

            // Listen for voices to load
            window.speechSynthesis.onvoiceschanged = loadVoices;

            // Try loading immediately
            loadVoices();
        }
    }, []);

    // Activate TTS with user interaction (required by browsers)
    const activate = useCallback(() => {
        if (!isSupported) {
            console.warn('Text to speech not supported');
            return;
        }

        console.log('Activating text-to-speech...');

        // Safari workaround: speak empty utterance to "wake up" speech synthesis
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0; // Silent
        window.speechSynthesis.speak(utterance);

        setIsActivated(true);
        console.log('Text-to-speech activated!');
    }, [isSupported]);

    const speak = useCallback((text, rate = 0.8, onEnd) => {
        if (!isSupported) {
            console.warn('Text to speech not supported');
            return;
        }

        if (!isActivated) {
            console.warn('Text to speech not activated yet - user interaction required');
            return;
        }

        console.log('Speaking:', text);

        // Cancel any pending speech to avoid "stuck" queue (Chrome bug workaround)
        window.speechSynthesis.cancel();

        // Small delay after cancel to ensure it completes
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance; // Keep reference to prevent GC

            // Set properties explicitly
            utterance.rate = rate; // 0.8 is 20% slower than default 1.0
            utterance.volume = 1.0; // Explicit full volume
            utterance.pitch = 1.0; // Normal pitch

            // Try to select a voice explicitly
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Prefer English voice
                const englishVoice = voices.find(v => v.lang.startsWith('en-'));
                if (englishVoice) {
                    utterance.voice = englishVoice;
                    console.log('Using voice:', englishVoice.name, englishVoice.lang);
                } else {
                    utterance.voice = voices[0];
                    console.log('Using default voice:', voices[0].name, voices[0].lang);
                }
            } else {
                console.warn('No voices available!');
            }

            utterance.onstart = () => {
                console.log('✅ Started speaking - audio should be playing now!');
                console.log('Utterance properties:', {
                    volume: utterance.volume,
                    rate: utterance.rate,
                    pitch: utterance.pitch,
                    voice: utterance.voice?.name,
                    lang: utterance.lang
                });
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                console.log('Finished speaking');
                setIsSpeaking(false);
                utteranceRef.current = null;
                if (onEnd) onEnd();
            };

            utterance.onerror = (e) => {
                console.error('❌ Speech error:', e);
                console.error('Error details:', {
                    error: e.error,
                    charIndex: e.charIndex,
                    elapsedTime: e.elapsedTime
                });
                setIsSpeaking(false);
                utteranceRef.current = null;
                // Continue cycle even on error
                if (onEnd) onEnd();
            };

            console.log('Calling speechSynthesis.speak()...');
            window.speechSynthesis.speak(utterance);

            // Check if speaking started
            setTimeout(() => {
                const isSpeaking = window.speechSynthesis.speaking;
                const isPending = window.speechSynthesis.pending;
                console.log('Speech status check:', { speaking: isSpeaking, pending: isPending });
                if (!isSpeaking && !isPending) {
                    console.error('⚠️ Speech did not start! Browser may have blocked it.');
                }
            }, 100);
        }, 50);
    }, [isSupported, isActivated]);

    const cancel = useCallback(() => {
        if (isSupported) {
            console.log('Cancelling speech...');
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            utteranceRef.current = null;
        }
    }, [isSupported]);

    return { speak, cancel, activate, isSupported, isSpeaking, isActivated };
};
