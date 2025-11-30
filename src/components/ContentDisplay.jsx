import { useState, useEffect, useRef, useCallback } from 'react';
import { quotes as fallbackQuotes, jokes as fallbackJokes } from '../data/quotesAndJokes';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import googleSheetsService from '../services/googleSheets';

const ContentDisplay = ({ isActive, onContentPlayed }) => {
    const [content, setContent] = useState(null);
    const [library, setLibrary] = useState({ quotes: [], jokes: [] });
    const { speak, cancel, activate, isActivated } = useTextToSpeech();
    const libraryRef = useRef({ quotes: [], jokes: [] });
    const timeoutRef = useRef(null);
    const isMounted = useRef(true);
    const nextTypeRef = useRef('quote');
    const cycleIdRef = useRef(0); // Track cycle calls

    // Update ref when library changes
    useEffect(() => {
        libraryRef.current = library;
    }, [library]);

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

        if (!item) return "Stay focused!";

        // Handle object vs string
        if (typeof item === 'object') {
            return item.text || "Keep pushing!";
        }
        return String(item);
    };

    const isActiveRef = useRef(isActive);

    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    const onContentPlayedRef = useRef(onContentPlayed);

    useEffect(() => {
        onContentPlayedRef.current = onContentPlayed;
    }, [onContentPlayed]);

    const cycleContentRef = useRef(null);
    const cancelRef = useRef(cancel);

    // Update refs when functions change
    useEffect(() => {
        cancelRef.current = cancel;
    }, [cancel]);

    const cycleContent = useCallback(() => {
        if (!isActiveRef.current || !isMounted.current) return;

        const cycleId = ++cycleIdRef.current;
        console.log(`🔄 [Cycle ${cycleId}] Starting cycle...`);

        // Ensure we have content
        const currentLib = libraryRef.current;
        const currentQuotes = currentLib.quotes.length > 0 ? currentLib.quotes : fallbackQuotes;
        const currentJokes = currentLib.jokes.length > 0 ? currentLib.jokes : fallbackJokes;

        const type = nextTypeRef.current;
        const text = type === 'quote' ? getRandomItem(currentQuotes) : getRandomItem(currentJokes);

        if (!text) {
            console.warn(`⚠️ [Cycle ${cycleId}] No text to speak, skipping cycle`);
            if (isMounted.current && isActiveRef.current) {
                console.log(`⏰ [Cycle ${cycleId}] Setting retry timeout (1s)`);
                timeoutRef.current = setTimeout(() => {
                    if (cycleContentRef.current) {
                        cycleContentRef.current();
                    }
                }, 1000);
            }
            return;
        }

        console.log(`📝 [Cycle ${cycleId}] Content: "${text.substring(0, 50)}..."`);
        setContent({ type, text });

        // Report back to parent using ref to avoid dependency change
        if (onContentPlayedRef.current) {
            onContentPlayedRef.current({ type, text });
        }

        // Track if callback has been called
        let callbackCalled = false;
        const handleSpeechEnd = () => {
            if (callbackCalled) {
                console.error(`❌ [Cycle ${cycleId}] onEnd callback called AGAIN! This will create duplicate timeouts!`);
                return;
            }
            callbackCalled = true;
            console.log(`✅ [Cycle ${cycleId}] Speech finished, waiting 5s...`);

            // On finish speaking, wait 5 seconds then cycle again
            if (isMounted.current && isActiveRef.current) {
                console.log(`⏰ [Cycle ${cycleId}] Setting next cycle timeout (5s)`);
                timeoutRef.current = setTimeout(() => {
                    nextTypeRef.current = type === 'quote' ? 'joke' : 'quote';
                    console.log(`⏰ [Cycle ${cycleId}] Timeout fired, calling next cycle`);
                    if (cycleContentRef.current) {
                        cycleContentRef.current();
                    }
                }, 5000);
            }
        };

        // Speak the content
        speak(text, 0.8, handleSpeechEnd);
    }, [speak]);

    // Effect 1: Handle unmount cleanup ONLY
    useEffect(() => {
        isMounted.current = true;
        console.log('📦 ContentDisplay mounted');
        return () => {
            console.log('📦 ContentDisplay unmounting - clearing timeout only');
            isMounted.current = false;
            // Don't call cancel() here - Effect 2 handles it when isActive changes
            // Calling cancel() here causes speech to stop during Strict Mode remounts
            if (timeoutRef.current) {
                console.log('🧹 Clearing timeout on unmount');
                clearTimeout(timeoutRef.current);
            }
        };
    }, []); // Empty dependency array = run only on mount/unmount

    // Effect 2: Auto-activate audio and handle active state changes
    useEffect(() => {
        console.log(`🎬 Effect triggered: isActive=${isActive}, isActivated=${isActivated}`);

        if (isActive) {
            // Auto-activate audio when workout starts
            if (!isActivated) {
                console.log('🔊 Auto-activating audio...');
                activate();
            }
            // Start the cycle
            console.log('▶️ Starting content cycle (isActive=true)');
            if (timeoutRef.current) {
                console.log('🧹 Clearing existing timeout before starting new cycle');
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                console.log('⏰ Initial timeout fired, starting first cycle');
                if (cycleContentRef.current) {
                    cycleContentRef.current();
                }
            }, 500);
        } else {
            // Stop speech if we become inactive
            console.log('⏹️ Stopping content cycle (isActive=false)');
            if (cancelRef.current) {
                cancelRef.current();
            }
            if (timeoutRef.current) {
                console.log('🧹 Clearing timeout');
                clearTimeout(timeoutRef.current);
            }
            setContent(null);
            // Reset to start with quote next time
            nextTypeRef.current = 'quote';
            cycleIdRef.current = 0; // Reset cycle counter
        }
    }, [isActive, isActivated]); // Only depend on isActive and isActivated

    // Store cycleContent in ref after it's defined
    useEffect(() => {
        cycleContentRef.current = cycleContent;
    }, [cycleContent]);

    // Show status indicator when active but no content yet
    if (isActive && !content) {
        return (
            <div className="content-display-box audio-enabled-indicator">
                <div className="audio-status">
                    <span className="audio-status-icon">🔊</span>
                    <span className="audio-status-text">Audio Enabled</span>
                </div>
            </div>
        );
    }

    if (!content || !isActive) return null;

    return (
        <div className="content-display-box">
            <div className="content-type-label">
                {content.type === 'quote' ? '💡 Quote' : '😂 Joke'}
            </div>
            <p className="content-text">"{content.text}"</p>
            <div className="audio-status-small">
                <span className="audio-status-icon-small">🔊</span>
            </div>
        </div>
    );
};

export default ContentDisplay;
