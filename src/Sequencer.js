import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import Slider from './Slider'

class Sequencer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      length: 8,
      sequence: ["C2", "C2", "C3", "C3", false, "C2", "C3", "C3"],
      gateTime: 1.0
    }
  }

  scheduleEvents(beatNumber, time) {
    const { sequence, length, gateTime } = this.state
    const { playNote, stopNote } = this.props

    let secondsPerBeat = 60.0 / this.props.tempo;  // picks up the CURRENT tempo value!
    let duration = secondsPerBeat * 1000 / 4 * gateTime; // Add 1/4 of quarter-note beat length to time
    let note = sequence[beatNumber % length]

    if (note) {
      // play and stop note on the connected device
      console.log(beatNumber, 'SEQ BASS NOTE', note, 'scheduled from ', time, 'to', time + duration)
      playNote(note, 1.0, undefined, time)
      stopNote(note, time + duration)
    } else {
      console.log(beatNumber, 'SEQ BASS NO EVENTS')
    }
  }

  setGateTime(gateTime) {
    this.setState({
      gateTime: gateTime
    })
  }

  onSliderChange(val) {
    console.log('Slider val changed to', val)
  }

  render() {
    const { gateTime, sequence } = this.state

    return (
      <div>
        <h2>Seq {sequence.join(' - ')}</h2>
        <label>
          Gate Time
          <input type="number" step="0.1" min="0.0" max="1.0" 
            value={gateTime}
            onChange={(ev) => this.setGateTime(ev.target.value)}/>
          <Slider min="0" max={127} step="1" defaultValue="64" onChange={(val) => this.onSliderChange(val)} />
          <Slider onChange={(val) => this.onSliderChange(val)} size="small" />
          <Slider min="0" max="1" step="0.1" defaultValue="1" onChange={(val) => this.onSliderChange(val)} />
        </label>
      </div>

    )
  }
}

export default Sequencer
