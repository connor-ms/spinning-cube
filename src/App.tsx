import { useState } from 'react';
import View from './components/View';
import SettingsPanel, { Settings } from './components/Settings';
import './App.css';

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    paused: false,
    thetaX: 0,
    thetaY: 0,
    thetaZ: 0,
    rotationSpeed: 5,
    frametime: 50,
    delta: 5
  });

  return (
    <div className="App">
      <header className="App-header">
        <SettingsPanel settings={settings} setSettings={setSettings} />
        <View settings={settings} setSettings={setSettings} />
      </header>
    </div>
  );
}