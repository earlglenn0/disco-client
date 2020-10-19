import React, { Component } from 'react'

export class DiscoLights extends Component {
    render() {
        return (
            <div>
                <div className='disco_balls'>
                    {/* <img id='bLeft' className='ball_left' src="https://www.animatedimages.org/data/media/1139/animated-disco-light-image-0015.gif" alt='disco lights'></img> */}
                    <img id='bRight' className='ball_1' src="./disco1.png" alt='disco lights'></img>
                    <img id='bRight' className='ball_2' src="./disco2.png" alt='disco lights'></img>
                    <img id='bRight' className='ball_1' src="./disco1.png" alt='disco lights'></img>
                    <img id='bRight' className='ball_2' src="./disco2.png" alt='disco lights'></img>
                    <img id='bRight' className='ball_1' src="./disco1.png" alt='disco lights'></img>
                    <img id='bRight' className='ball_2' src="./disco2.png" alt='disco lights'></img>
                </div>
            </div>
        )
    }
}


export default DiscoLights
