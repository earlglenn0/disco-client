import React, { useState, useEffect } from 'react';
import './App.css';
import fill from 'lodash/fill'
import shuffle from 'lodash/shuffle'
import flatten from 'lodash/flatten'
import chunk from 'lodash/chunk'

/** HELPERS */
const multiplyEachItemBy = (arr, num) => {
  return arr.reduce((arr2, cur) => [...arr2, fill(Array(arr.length), cur)], [])
}

/** CONSTANTS */
const brightColors = ['red', 'yellow', 'orange', 'purple', 'blue', 'green']
const grayColors = fill(Array(6), 'gray')
const grayLights = multiplyEachItemBy(grayColors)
const brightLights = multiplyEachItemBy(brightColors)


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
  const [intervalObj, setIntervalObj] = useState(null)
  const [lights, setLights] = useState(grayLights)

  useEffect(() => {
    if (data && Object.keys(data).length) {
      console.log({ isOn, xxx: data.isOn })

      /** TURN ON/OFF */
      if (isOn !== data.isOn) {
        setIsOn(data.isOn)
        if (!isOn) {
          setLights(grayLights)
          clearInterval(intervalObj)
          setIntervalObj(null)
        }
        if (data.isOn) {
          setIntervalObj(setInterval(() => {
            console.log('turning on')
            setLights([...brightLights])
          }, 1000))
        }
      }

      /** SET SPEED */
      if (speed !== data.speed) {
        setSpeed(data.speed)
        clearInterval(intervalObj)
        if (!isOn) {
          return
        }
        const intervalSpeed = {
          low: 1000,
          medium: 750,
          high: 500
        }[data.speed]
        setIntervalObj(setInterval(() => {
          console.log('set speed')
          setLights([...(isOn ? brightLights : grayLights)])
        }, intervalSpeed))
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
      <h2>{name.toUpperCase()}</h2>
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
      <div className='body'>
        <h1>{`DISCO MACHINE --- ${clicks}/${max_clicks}`}</h1>
        {getDisplayLights().map((e, i) => (
          <div className='row' key={i}>
            {e.map((ee, i) => (
              <span key={`${ee}-${i}`} className={getBulbClassName(ee)} style={{ backgroundColor: ee }}></span>
            ))}
          </div>
        ))}
      </div>
      <div className='controls'>
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
        <Button
          label={isOn ? 'TURN OFF' : 'TURN ON'}
          onClick={() => sendEvent(isOn ? 'TURN_OFF' : 'TURN_ON')}
          className='special'
          disabled={isBroken}
        />
      </div>
    </div>
  );
}

export default Disco;
