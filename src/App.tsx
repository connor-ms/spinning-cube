import { useState } from 'react';
import View from './components/View';
import SettingsPanel, { Settings } from './components/Settings';
import './App.css';

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    paused: false
  });

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <div className="App">
      <header className="App-header">
        <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
        <View settings={settings} />
      </header>
    </div>
  );
}