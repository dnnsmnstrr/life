import React, { useState, useEffect } from 'react';
import './App.css';
import LifeTimeline from './LifeTimeline'

function App() {
  const [events, setEvents] = useState([])
  const handleEvents = async () => {
    const response = await fetch('https://next.muensterer.xyz/api/events')
    const json = await response.json()
    setEvents(json)
  }
  useEffect(() => {
    handleEvents()
  }, [])
  return (
    <div className="App">
      <p>
        My life in weeks
      </p>
      <LifeTimeline
        events={events}
        subject={{
          name: 'Dennis',
          birthday: new Date('1997-06-16')
        }}
      />
    </div>
  );
}

export default App;
