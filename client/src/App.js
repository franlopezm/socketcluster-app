import { useEffect } from 'react'
import './App.css';

import socket from './socket'

function App() {
  useEffect(() => {
    socket.start()

    socket.subscribe('prueba')

    return function cleanUp() {
      socket.destroy()
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
