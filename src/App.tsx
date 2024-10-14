import { useEffect, useState } from 'react'
import './App.css'
import LifeTimeline from './LifeTimeline'
import { Event } from './types'
import jsonEvents from './events.json'

function App() {
  const [events, setEvents] = useState<Event[]>([])

  const loadEvents = async () => {
    // const response = await fetch(import.meta.env.VITE_API_URL + 'events')
    // const jsonEvents = await response.json()
    console.log(jsonEvents)
    setEvents(jsonEvents)
  }
  
  useEffect(() => {
    loadEvents()
  }, [])
  return (
    <>
      <div className="App">
        <h1 className="title">
          My life in weeks
        </h1>
        <LifeTimeline
          events={events}
          subject={{ name: 'Dennis', birthdate: '1997-06-16', lifeExpectancy: 80 }}
        />
      </div>
    </>
  )
}

export default App
