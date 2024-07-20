import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const [cube, setCube] = useState<string>(""); //63x31

  return (
    <div className="App">
      <header className="App-header">
        <textarea className="View" placeholder={cube}></textarea>
      </header>
    </div>
  );
}

export default App;
