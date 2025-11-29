import { useState, useEffect, useRef, useCallback } from 'react';
import { quotes as fallbackQuotes, jokes as fallbackJokes } from '../data/quotesAndJokes';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import googleSheetsService from '../services/googleSheets';

const ContentDisplay = ({ isActive, onContentPlayed }) => {
    const [content, setContent] = useState(null);
    const [library, setLibrary] = useState({ quotes: [], jokes: [] });
    const { speak, cancel } = useTextToSpeech();
    const timeoutRef = useRef(null);
    const isMounted = useRef(true);
    const nextTypeRef = useRef('quote');

    // Fetch content on mount
    useEffect(() => {
        const loadContent = async () => {
            const data = await googleSheetsService.getContent();
            if (data.quotes.length > 0 || data.jokes.length > 0) {
                console.log(`Loaded ${data.quotes.length} quotes and ${data.jokes.length} jokes from Sheets`);
                setLibrary(data);
            } else {
                console.log('Using fallback content');
                setLibrary({ quotes: fallbackQuotes, jokes: fallbackJokes });
            }
        };
        loadContent();
    }, []);

    const getRandomItem = (array) => {
        if (!array || array.length === 0) return "Loading...";
        const item = array[Math.floor(Math.random() * array.length)];
        // Handle object vs string (Sheets returns objects for quotes, strings for jokes usually, but let's normalize)
        if (typeof item === 'object' && item.text) return item.text;
        return item;
    };

    const isActiveRef = useRef(isActive);

    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    const cycleContent = useCallback(() => {
        if (!isActiveRef.current || !isMounted.current) return;

        // Ensure we have content
        const currentQuotes = library.quotes.length > 0 ? library.quotes : fallbackQuotes;
        const currentJokes = library.jokes.length > 0 ? library.jokes : fallbackJokes;

        console.log('Cycling content...');
        const type = nextTypeRef.current;
        const text = type === 'quote' ? getRandomItem(currentQuotes) : getRandomItem(currentJokes);

        setContent({ type, text });

        // Report back to parent
        if (onContentPlayed) {
            onContentPlayed({ type, text });
        }

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
    }, [speak, library, onContentPlayed]);

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
