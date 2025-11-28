import { useState, useEffect } from 'react';
import '../styles/App.css';

const LootBox = ({ reward, onClose }) => {
    const [status, setStatus] = useState('closed'); // closed, opening, open

    const handleOpen = () => {
        if (status === 'closed') {
            setStatus('opening');
            setTimeout(() => {
                setStatus('open');
            }, 1000); // 1s opening animation
        }
    };

    return (
        <div className="loot-box-overlay">
            <div className={`loot-box-container ${status}`}>
                {status === 'closed' && (
                    <div className="loot-box-closed" onClick={handleOpen}>
                        <div className="loot-box-shake">🎁</div>
                        <p>Tap to Open!</p>
                    </div>
                )}

                {status === 'opening' && (
                    <div className="loot-box-opening">
                        <div className="loot-box-burst">💥</div>
                    </div>
                )}

                {status === 'open' && (
                    <div className="loot-box-content">
                        <h3>You found a reward!</h3>

                        {reward.type === 'quote' && (
                            <div className="reward-quote">
                                <blockquote>"{reward.content}"</blockquote>
                            </div>
                        )}

                        {reward.type === 'gif' && (
                            <div className="reward-gif">
                                <img src={reward.content} alt="Celebration GIF" />
                            </div>
                        )}

                        {reward.type === 'bonus' && (
                            <div className="reward-bonus">
                                <span className="bonus-amount">+{reward.content}</span>
                                <span className="bonus-label">Consistency Points!</span>
                            </div>
                        )}

                        <button className="btn btn-primary" onClick={onClose}>
                            Awesome!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LootBox;
