import { useState, useEffect, useRef, useCallback } from 'react';
import { quotes, jokes } from '../data/quotesAndJokes';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const ContentDisplay = ({ isActive }) => {
    const [content, setContent] = useState(null);
    const { speak, cancel } = useTextToSpeech();
    const timeoutRef = useRef(null);
    const isMounted = useRef(true);
    const nextTypeRef = useRef('quote');

    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    const isActiveRef = useRef(isActive);

    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    const cycleContent = useCallback(() => {
        if (!isActiveRef.current || !isMounted.current) return;

        console.log('Cycling content...');
        const type = nextTypeRef.current;
        const text = type === 'quote' ? getRandomItem(quotes) : getRandomItem(jokes);

        setContent({ type, text });

        // Speak the content
        speak(text, 0.8, () => {
            console.log('Speech finished, waiting 5s...');
            // On finish speaking, wait 5 seconds then cycle again
            if (isMounted.current && isActiveRef.current) {
                timeoutRef.current = setTimeout(() => {
                    nextTypeRef.current = type === 'quote' ? 'joke' : 'quote';
                    cycleContent();
                }, 5000);
            }
        });
    }, [speak]);

    useEffect(() => {
        isMounted.current = true;

        if (isActive) {
            // Start the cycle
            cycleContent();
        } else {
            // Cleanup
            cancel();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setContent(null);
            // Reset to start with quote next time
            nextTypeRef.current = 'quote';
        }

        return () => {
            isMounted.current = false;
            cancel();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isActive, cycleContent, cancel]);

    if (!content || !isActive) return null;

    return (
        <div className="content-display-box">
            <div className="content-type-label">
                {content.type === 'quote' ? '💡 Quote' : '😂 Joke'}
            </div>
            <p className="content-text">"{content.text}"</p>
        </div>
    );
};

export default ContentDisplay;
