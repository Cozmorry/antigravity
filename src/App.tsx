import { useState } from 'react';
import './App.css';
import NeuralNetwork from './components/NeuralNetwork';
import TerminalOverlay from './components/TerminalOverlay';
import Interface from './components/Interface';

function App() {
  const [particleCount, setParticleCount] = useState(100);
  const [connectionDistance, setConnectionDistance] = useState(150);
  const [baseSpeed, setBaseSpeed] = useState(1.0);
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Key forces re-mount when particle count changes to re-init array */}
      <NeuralNetwork
        key={particleCount}
        particleCount={particleCount}
        connectionDistance={connectionDistance}
        baseSpeed={baseSpeed}
      />
      <TerminalOverlay />
      <Interface
        particleCount={particleCount}
        setParticleCount={setParticleCount}
        connectionDistance={connectionDistance}
        setConnectionDistance={setConnectionDistance}
        baseSpeed={baseSpeed}
        setBaseSpeed={setBaseSpeed}
        isOpen={isInterfaceOpen}
        setIsOpen={setIsInterfaceOpen}
      />
      <main>
        <h1>NEURAL SYMPHONY</h1>
      </main>
    </div>
  )
}

export default App;
