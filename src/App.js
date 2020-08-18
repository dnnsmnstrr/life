import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import LifeTimeline from './LifeTimeline'
function App() {
  const [events, setEvents] = useState([])
  const handleEvents = async (cb) => {
    const response = await fetch('https://next.muensterer.xyz/api/events')
    const json = await response.json()
    console.log('json', json)
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
      subject={{birthday: new Date('1997-06-16'), name: 'Dennis'}}
      />
    </div>
  );
}

export default App;
