import { useState } from 'react';
import openaiService from '../services/openaiService';
import googleSheetsService from '../services/googleSheets';

const ExternalWorkout = ({ onComplete, onCancel, isTestMode }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setAnalyzing(true);
        setError(null);

        try {
            const stats = await openaiService.extractWorkoutStats(preview);
            setAnalysisResult(stats);
        } catch (err) {
            setError("Failed to analyze image. Please try again.");
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Upload Image
            let imageLink = "Test Mode - Local Image";
            if (!isTestMode) {
                imageLink = await googleSheetsService.uploadImageToDrive(file);
            }

            // 2. Save Data
            const workoutData = {
                date: new Date().toLocaleDateString(),
                type: analysisResult.type,
                duration: analysisResult.duration,
                calories: analysisResult.calories,
                distance: analysisResult.distance,
                rawJson: analysisResult,
                imageLink: imageLink,
                points: 50 // Flat bonus for now
            };

            if (isTestMode) {
                // In test mode, we might just log it or save to a local list if we had one
                console.log("Test Mode Save:", workoutData);
                alert("Test Mode: Workout analyzed but not saved to Sheets.");
            } else {
                await googleSheetsService.saveExternalWorkout(workoutData);
            }

            onComplete(workoutData.points);
        } catch (err) {
            setError("Failed to save workout. Ensure you are connected to Google.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="external-workout-container">
            <h2>Log External Workout 📸</h2>

            {!analysisResult ? (
                <div className="upload-section">
                    <div className="file-drop-area">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview ? (
                            <img src={preview} alt="Preview" className="image-preview" />
                        ) : (
                            <p>Tap to take photo or upload</p>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleAnalyze}
                        disabled={!file || analyzing}
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Photo 🪄'}
                    </button>
                </div>
            ) : (
                <div className="results-section">
                    <h3>Analysis Results</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <label>Type</label>
                            <input value={analysisResult.type} onChange={(e) => setAnalysisResult({ ...analysisResult, type: e.target.value })} />
                        </div>
                        <div className="stat-item">
                            <label>Duration (mins)</label>
                            <input type="number" value={analysisResult.duration} onChange={(e) => setAnalysisResult({ ...analysisResult, duration: e.target.value })} />
                        </div>
                        <div className="stat-item">
                            <label>Calories</label>
                            <input type="number" value={analysisResult.calories} onChange={(e) => setAnalysisResult({ ...analysisResult, calories: e.target.value })} />
                        </div>
                        <div className="stat-item">
                            <label>Distance</label>
                            <input value={analysisResult.distance || ''} onChange={(e) => setAnalysisResult({ ...analysisResult, distance: e.target.value })} />
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => setAnalysisResult(null)}>Retake</button>
                        <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save & Claim 50 Pts ✅'}
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button className="btn-close" onClick={onCancel}>×</button>
        </div>
    );
};

export default ExternalWorkout;
