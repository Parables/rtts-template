import React, { useState, useEffect } from 'react';
import './App.css';
import './tailwind.css';
import LogoIcon from './logo.svg'
interface AppProps {}

function App({}: AppProps) {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);
  // Return the App component.
  return (
    <div className="App">
      <header className="App-header">
        <LogoIcon  className="App-logo"/>
        <p className="text-yellow-500">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p className="text-blue-500">
          Page has been open for <code>{count}</code> seconds.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
