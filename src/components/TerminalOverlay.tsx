import React, { useEffect, useState } from 'react';
import './TerminalOverlay.css';

const BOOT_SEQUENCE = [
    "INITIALIZING NEURAL INTERFACE...",
    "LOADING CORE MODULES...",
    "ESTABLISHING SYNAPSE CONNECTIONS...",
    "OPTIMIZING NETWORK LATENCY...",
    "SYSTEM ONLINE.",
    "WELCOME, USER.",
];

const TerminalOverlay: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    // Use refs to avoid closure staleness in setTimeout/interval if we used that approach,
    // but here we can just rely on the effect dependency chain or a recursive timeout.

    useEffect(() => {
        if (currentLineIndex >= BOOT_SEQUENCE.length) return;

        const currentLineText = BOOT_SEQUENCE[currentLineIndex];

        if (currentCharIndex < currentLineText.length) {
            const timeoutId = setTimeout(() => {
                setLines(prev => {
                    const newLines = [...prev];
                    if (newLines[currentLineIndex] === undefined) {
                        newLines[currentLineIndex] = "";
                    }
                    newLines[currentLineIndex] = currentLineText.substring(0, currentCharIndex + 1);
                    return newLines;
                });
                setCurrentCharIndex(prev => prev + 1);
            }, 30 + Math.random() * 50); // Random typing speed

            return () => clearTimeout(timeoutId);
        } else {
            // Line finished, wait a bit before next line
            const timeoutId = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 400);

            return () => clearTimeout(timeoutId);
        }
    }, [currentLineIndex, currentCharIndex]);

    return (
        <div className="terminal-overlay">
            <div className="terminal-content">
                {lines.map((line, i) => (
                    <div key={i} className="terminal-line">
                        <span className="prompt">{'>'}</span> {line}
                    </div>
                ))}
                <div className="cursor">_</div>
            </div>
        </div>
    );
};

export default TerminalOverlay;
