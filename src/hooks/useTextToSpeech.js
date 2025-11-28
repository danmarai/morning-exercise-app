import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setIsSupported(true);
        }
    }, []);

    const speak = useCallback((text, rate = 0.8, onEnd) => {
        if (!isSupported) {
            console.warn('Text to speech not supported');
            return;
        }

        console.log('Speaking:', text);

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate; // 0.8 is 20% slower than default 1.0

        utterance.onstart = () => {
            console.log('Started speaking');
            setIsSpeaking(true);
        };
        utterance.onend = () => {
            console.log('Finished speaking');
            setIsSpeaking(false);
            if (onEnd) onEnd();
        };
        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            setIsSpeaking(false);
            // Continue cycle even on error
            if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    const cancel = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [isSupported]);

    return { speak, cancel, isSupported, isSpeaking };
};
