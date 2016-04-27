import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class Sequencer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      length: 8,
      sequence: ["C2", "C2", "C3", "C3", false, "C2", "C3", "C3"]
    }
  }

  scheduleEvents(beatNumber, time) {
    const { sequence, length } = this.state
    const { webMidi, midiDevice, midiChannel } = this.props

    let secondsPerBeat = 60.0 / this.props.tempo;  // picks up the CURRENT tempo value!
    let duration = secondsPerBeat * 1000 / 4; // Add 1/4 of quarter-note beat length to time
    let note = sequence[beatNumber % length]

    if (note) {
      // play and stop note on the connected device
      webMidi.playNote(note, 1.0, undefined, midiDevice, midiChannel, time)
      webMidi.stopNote(note, 0.5, midiDevice, midiChannel, time + duration)
      console.log(beatNumber, 'SEQ BASS NOTE', note, 'scheduled from ', time, 'to', time + duration)
    } else {
      console.log(beatNumber, 'SEQ BASS NO EVENTS')
    }
  }

  onBpmCount(count) {

  }

  render() {
    return (
      <div>Seq {this.state.sequence.join(' - ')}</div>
    )
  }
}

export default Sequencer
