import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import Renderer from './render';

function App() {
  const [cube, setCube] = useState<string>("");

  let renderer = new Renderer(75, 75);

  useEffect(() => {
    //setCube(renderer.buildNextFrame());
    const interval = setInterval(() => setCube(renderer.buildNextFrame(5)), 50);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <textarea className="View" value={cube}></textarea>
      </header>
    </div>
  );
}

export default App;
