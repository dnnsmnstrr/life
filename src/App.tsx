import { useEffect, useState, useRef } from 'react'
import './App.css'
import LifeTimeline from './LifeTimeline'
import { Event } from './types'
import jsonEvents from './events.json'
import deaths from './deaths.json'
import { SettingsIcon, XIcon } from 'lucide-react'

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [showDeaths, setShowDeaths] = useState<boolean>(false) // New state for deaths visibility
  const dialogRef = useRef<HTMLDialogElement>(null); // Reference to the dialog

  const loadEvents = async () => {
    // const response = await fetch(import.meta.env.VITE_API_URL + 'events')
    // const jsonEvents = await response.json()
    console.log(jsonEvents)
    setEvents(jsonEvents)
  }
  
  useEffect(() => {
    loadEvents()
  }, [])

  const toggleDeathsVisibility = () => {
    setShowDeaths(prev => !prev) // Toggle visibility
  }

  const openDialog = () => {
    dialogRef.current?.showModal(); // Open the dialog
  }

  const closeDialog = () => {
    dialogRef.current?.close(); // Close the dialog
  }

  return (
    <>
      <div className="App">
        <h1 className="title">
          My life in weeks
          <button onClick={openDialog} style={{ position: 'absolute', top: 60, right: 62, height: 39, width: 39 }}><SettingsIcon /></button> {/* Button to open settings */}
        </h1>
        
        <dialog ref={dialogRef} style={{ paddingBottom: 20, paddingTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Settings</h2>
            <button onClick={closeDialog} style={{ marginLeft: 10, height: 35, width: 40, paddingTop: 3 }}><XIcon /></button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              checked={showDeaths} 
              onChange={toggleDeathsVisibility} 
            />
            <span style={{ marginLeft: 5 }}>Show Deaths</span>
          </label>
        </dialog>
        
        <LifeTimeline
          events={events}
          famousDeaths={showDeaths ? deaths : []} // Pass deaths based on visibility
          subject={{ name: 'Dennis', birthdate: '1997-06-16', lifeExpectancy: 80 }}
        />
      </div>
    </>
  )
}

export default App
