import React, { useState, useEffect } from 'react';
import './App.css';
import fill from 'lodash/fill'
import shuffle from 'lodash/shuffle'
import flatten from 'lodash/flatten'
import chunk from 'lodash/chunk'
import DiscoLights from './DiscoLights'

/** HELPERS */
const multiplyEachItemBy = (arr, num) => {
  return arr.reduce((arr2, cur) => [...arr2, fill(Array(arr.length-2), cur)], [])
}

/** CONSTANTS */
const brightColors = ['red', 'yellow', 'orange', 'purple', 'blue', 'green']
const grayColors = fill(Array(6), 'transparent')
const grayLights = multiplyEachItemBy(grayColors)
const brightLights = multiplyEachItemBy(brightColors)
// const lightsOff = 


/** CUSTOM ELEMENTS */
const Button = ({ label, active, className = '', ...props }) => (
  <button className={className + (active ? ' active' : '')} {...props}>{label}</button>
)

function Disco(props) {
  const { data, sendEvent } = props

  const [isOn, setIsOn] = useState(false)
  const [isBroken, setIsBroken] = useState(false)
  const [color, setColor] = useState('steady')
  const [speed, setSpeed] = useState('low')
  const [lightMode, setLightMode] = useState('steady')
  const [lights, setLights] = useState(grayLights)

  useEffect(() => {
    if (data && Object.keys(data).length) {

      /** TURN ON/OFF */
      if (isOn !== data.isOn) {
        setIsOn(data.isOn) 
      }

      /** SET SPEED */
      if (speed !== data.speed) {
        setSpeed(data.speed)
      }

      /** SET COLOR */
      if (color !== data.color) {
        setColor(data.color)
      }

      /** SET LIGHT MODE */
      if (lightMode !== data.lightMode) {
        setLightMode(data.lightMode)
      }

      if (isBroken !== data.isBroken) {
        setIsBroken(data.isBroken)
      }

      setLights(isOn ? brightLights : grayLights)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])

  const getDisplayLights = () => {
    let displayLights = lights
    if (!isOn || isBroken) {
      return grayLights
    }
    if (color === 'changing') {
      displayLights = chunk(
        shuffle(flatten(multiplyEachItemBy(brightColors))),
        6
      )
    }
    return displayLights
  }
  const disabledControl = !isOn
  const getBulbClassName = (bulbColor) => {
    let className = 'bulb'
    if (lightMode === 'flashing' && isOn && bulbColor !== 'gray') {
      className += ` flashing_${speed}`
    }
    if (isBroken) {
      className += ' broken'
    }
    return className
  }
  
  const Control = ({ name = '', onClick = () => {}, options = [],  disabled, status }) => (
    <>
      <h4>{name.toUpperCase()}</h4>
      {options.map(option => (
        <Button
          key={option}
          label={option.toUpperCase()}
          active={status === option}
          onClick={sendEvent.bind(null, `SET_${name.replace(' ', '').toUpperCase()}_TO_${option.toUpperCase()}`)}
          disabled={disabled}
        />
      ))}
    </>
  )
  const clicks = Number(data && data.clicks)
  const max_clicks = Number(data && data.max_clicks)
  return (
    <div className='App'>
      <div className='body disco_room'>
        <h1>{`DISCO MACHINE --- ${clicks}/${max_clicks}`}</h1>
        <DiscoLights/>
        {getDisplayLights().map((e, i) => (
          <div className='row' key={i}>
            {e.map((ee, i) => (
              <div 
                key={`${ee}-${i}`} 
                className={getBulbClassName(ee)} 
                style={{ backgroundColor:  ee, boxShadow: `0px 0px 70px 40px ${ee}` }}>

                <div class="ray_box">
                  <div class="ray ray1" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray2" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray3" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray4" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray5" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray6" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray7" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray8" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray9" style={{ backgroundColor:  ee }}></div>
                  <div class="ray ray10" style={{ backgroundColor:  ee }}></div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className='Bot_lights'>
          <DiscoLights/>
        </div>
        
      </div>
      <div className='remote_wrapper'>
        <div className='controls'>
          <Button
            label={isOn ? 'OFF' : 'ON'}
            onClick={() => sendEvent(isOn ? 'TURN_OFF' : 'TURN_ON')}
            className='special'
            disabled={isBroken}
          />
          <Control
            name='color'
            onClick={setColor}
            options={['steady', 'changing']}
            status={color}
            disabled={disabledControl}
          />
          <Control
            name='speed'
            onClick={setSpeed}
            options={['low', 'medium', 'high']}
            status={speed}
            disabled={disabledControl}
          />
          <Control
            name='light mode'
            onClick={setLightMode}
            options={['steady', 'flashing']}
            status={lightMode}
            disabled={disabledControl}
          />
        </div>
      </div>
    </div>
  );
}

export default Disco;
