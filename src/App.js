import React, { useState, useEffect } from 'react'
import './App.css'

import LifeTimeline from './LifeTimeline'

const API_URL = 'https://dnnsmnstrr.vercel.app/api/'

function App() {
  const [events, setEvents] = useState([])
  const [subject, setSubject] = useState({})
  
  const loadEvents = async () => {
    const response = await fetch(API_URL + 'events')
    const json = await response.json()
    setEvents(json)
  }
  const loadSubject = async () => {
    const response = await fetch(API_URL + 'dennis')
    const json = await response.json()
    setSubject(json)
  }
  
  useEffect(() => {
    loadEvents()
    loadSubject()
  }, [])
  
  return (
    <div className="App">
        <p className="title">
          My life in weeks
        </p>
        <LifeTimeline
          events={events}
          subject={subject}
        />
    </div>
  );
}

export default App;
