import { useState } from 'react';
import View from './components/View';
import SettingsPanel, { Settings } from './components/Settings';
import './App.css';

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    setting1: true
  });

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <div className="App">
      <header className="App-header">
        <SettingsPanel />
        <View settings={settings} onSettingsChange={handleSettingsChange} />
      </header>
    </div>
  );
}