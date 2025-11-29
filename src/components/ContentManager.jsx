import { useState } from 'react';
import axios from 'axios';
import googleSheetsService from '../services/googleSheets';

const ContentManager = ({ onClose }) => {
    const [status, setStatus] = useState('idle'); // idle, generating, saving, success, error
    const [message, setMessage] = useState('');

    const handleRefill = async () => {
        setStatus('generating');
        setMessage('Asking OpenAI for fresh jokes & quotes... (This takes about 10s)');

        try {
            // 1. Generate Content
            const response = await axios.post('/api/generate-content');
            const data = response.data;

            setStatus('saving');
            setMessage(`Got ${data.quotes.length} quotes and ${data.jokes.length} jokes! Saving to Google Sheets...`);

            // 2. Save to Sheets
            await googleSheetsService.saveContentBatch(data);

            setStatus('success');
            setMessage('Success! Your content vault has been refilled. 🎉');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to refill content. Check console for details.');
        }
    };

    return (
        <div className="content-manager-overlay">
            <div className="content-manager-modal">
                <h2>Manage Content Vault 📚</h2>
                <p>
                    Running low on fresh jokes? Use this tool to generate a new batch using OpenAI and save them directly to your Google Sheet.
                </p>

                <div className="status-area">
                    {status === 'idle' && (
                        <button className="btn btn-primary btn-large" onClick={handleRefill}>
                            ✨ Refill Content Vault
                        </button>
                    )}

                    {status === 'generating' && (
                        <div className="loading-spinner">
                            🤖 {message}
                        </div>
                    )}

                    {status === 'saving' && (
                        <div className="loading-spinner">
                            💾 {message}
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="success-message">
                            {message}
                            <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '1rem' }}>
                                Close
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="error-message">
                            ❌ {message}
                            <button className="btn btn-secondary" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                <button className="btn-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default ContentManager;
