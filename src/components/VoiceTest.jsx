import { useState, useEffect } from 'react';

const VoiceTest = () => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [testText] = useState("Testing voice playback. Can you hear me?");

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
        };

        if (window.speechSynthesis) {
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const testVoice = (voice = null) => {
        window.speechSynthesis.cancel();

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(testText);
            utterance.volume = 1.0;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            if (voice) {
                utterance.voice = voice;
                console.log('Testing voice:', voice.name, voice.lang);
            } else {
                console.log('Testing default voice');
            }

            utterance.onstart = () => {
                console.log('✅ Voice test started - listen for audio!');
            };

            utterance.onend = () => {
                console.log('Voice test ended');
            };

            utterance.onerror = (e) => {
                console.error('Voice test error:', e);
            };

            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    return (
        <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '12px', margin: '1rem 0' }}>
            <h2>🔊 Voice Testing Tool</h2>
            <p>Test different voices to find one that works. Listen for: "{testText}"</p>

            <button
                onClick={() => testVoice()}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    margin: '1rem 0',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Test Default Voice
            </button>

            <h3 style={{ marginTop: '2rem' }}>All Available Voices ({voices.length}):</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {voices.map((voice, index) => (
                    <div key={index} style={{ margin: '0.5rem 0' }}>
                        <button
                            onClick={() => {
                                setSelectedVoice(voice);
                                testVoice(voice);
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedVoice === voice ? '#2196F3' : '#fff',
                                color: selectedVoice === voice ? 'white' : '#333',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'left',
                                fontFamily: 'monospace'
                            }}
                        >
                            {voice.name} ({voice.lang}) {voice.default ? '⭐ DEFAULT' : ''}
                        </button>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
                💡 Tip: If none of these voices work, your system's text-to-speech might need to be reset in System Settings → Accessibility → Spoken Content
            </p>
        </div>
    );
};

export default VoiceTest;
