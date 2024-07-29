import RendererProvider from './components/RenderProvider';
import SettingsPanel from './components/Settings';
import View from './components/View';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RendererProvider>
          <SettingsPanel />
          <View />
        </RendererProvider>
      </header>
    </div>
  );
}