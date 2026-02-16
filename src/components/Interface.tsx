import React from 'react';
import './Interface.css';

interface InterfaceProps {
    particleCount: number;
    setParticleCount: (n: number) => void;
    connectionDistance: number;
    setConnectionDistance: (n: number) => void;
    baseSpeed: number;
    setBaseSpeed: (n: number) => void;
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
}

const Interface: React.FC<InterfaceProps> = ({
    particleCount,
    setParticleCount,
    connectionDistance,
    setConnectionDistance,
    baseSpeed,
    setBaseSpeed,
    isOpen,
    setIsOpen
}) => {
    return (
        <div className={`interface-panel ${isOpen ? 'open' : 'closed'}`}>
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? 'CLOSE CONFIG' : 'CONFIG'}
            </button>

            {isOpen && (
                <div className="controls">
                    <h3>SYSTEM PARAMETERS</h3>

                    <div className="control-group">
                        <label>NODE COUNT: {particleCount}</label>
                        <input
                            type="range"
                            min="20"
                            max="300"
                            value={particleCount}
                            onChange={(e) => setParticleCount(Number(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>SYNAPSE RANGE: {connectionDistance}px</label>
                        <input
                            type="range"
                            min="50"
                            max="300"
                            value={connectionDistance}
                            onChange={(e) => setConnectionDistance(Number(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>SPEED: {baseSpeed.toFixed(1)}x</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={baseSpeed}
                            onChange={(e) => setBaseSpeed(Number(e.target.value))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interface;
