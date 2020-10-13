import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

import Disco from './Disco'
const socket = io('http://localhost:3001/')

function App() {
  const [discoData, setDiscoData] = useState(null)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('client connect ')
    })
    socket.on('STATE_CHANGED', (data) => {
      setDiscoData(data)
    })
    socket.on('disconnect', () => {
      console.log('client disconnect')
    })
  }, [])

  const sendEvent = (name) => {
    socket.emit(name)
  }
  return (
    <div className='App'>
      <Disco data={discoData} sendEvent={sendEvent}/>
    </div>
  );
}

export default App;
