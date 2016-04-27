import React, { Component, PropTypes } from 'react'

import VolcaBass from './VolcaBass'
import PlaybackWorker from 'worker!./PlaybackWorker'

class Rack extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      playing: false,
      position: 0,
      tempo: 120.0,
      devices: [{type: 'VolcaBass'}],
      startTime: 0.0,
      lookahead: 25.0,
      scheduleAheadTime: 100.0
    }
    // Don't keep this in state or props, user has no direct control
    this.current16thNote = 0.0
    this.nextNoteTime = 0.0

    // The worker that will provide steady ticks when to schedule events 
    this.createPlaypackWorker()
  }

  changeTempo(bpm) {
    this.setState({
      tempo: bpm
    })
  }

  /* PLAYBACK CONTROL / TIMING / EVENTS */

  createPlaypackWorker() {
    const { lookahead } = this.state

    this.playbackWorker = new PlaybackWorker();

    this.playbackWorker.onmessage = (e) => {
      if (e.data == "tick") {
        // console.log("tick!");
        this.scheduler()
      } else {
        console.log("message: " + e.data)
      }
    }
    this.playbackWorker.postMessage({"interval": lookahead})
  }

  // Start playback for the whole rack, use webworker to trigger scheduler pulses
  play() {
    const { webMidi } = this.props
    
    this.current16thNote = 0
    this.nextNoteTime = webMidi.time
    this.playbackWorker.postMessage("start");
    this.setState({
      playing: true
    })
  }

  // Stop playback for the whole rack
  stop() {
    this.playbackWorker.postMessage("stop");
    this.setState({
      playing: false
    })
  }

  scheduler() {
    const { scheduleAheadTime } = this.state
    const { webMidi } = this.props
    // console.log('scheduler called', webMidi.time, this.nextNoteTime, this.current16thNote)

    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.nextNoteTime < webMidi.time + scheduleAheadTime ) {
      // console.log('scheduler while', webMidi.time, this.nextNoteTime, this.current16thNote)
      this.scheduleEvents(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  scheduleEvents(beatNumber, time) {
    const { devices, tempo } = this.state
    const bass = this.refs['bass']
    
    let secondsPerBeat = 60.0 / tempo;  // picks up the CURRENT tempo value!
    let duration = secondsPerBeat * 1000 / 4; // Add 1/4 of quarter-note beat length to time

    // TODO: Ask all instruments/devices in rack to schedule events
    this.refs['bass'].scheduleEvents(beatNumber, time)
  }

  nextNote() {
    const { tempo } = this.state

    // Advance current note and time by a 16th note...
    let secondsPerBeat = 60.0 / tempo;  // picks up the CURRENT tempo value!
    
    this.nextNoteTime += (secondsPerBeat * 1000 / 4),  // Add 1/4 of quarter-note beat length to time,
    this.current16thNote = (this.current16thNote + 1) % 16  // Advance the beat number, wrap to zero
  }

  /* RENDERING */

  render() {
    const { playing, tempo, devices } = this.state
    const { webMidi } = this.props

    return (
      <div>
        <div id="master-controls">
          <label>
            BPM
            <input type="number" value={tempo}
              onChange={(event) => this.changeTempo(event.target.value)} />
          </label>
          <button disabled={playing}
            onClick={() => this.play()}>
            Play</button>
          <button disabled={!playing} 
            onClick={() => this.stop()}>
            Stop</button>
        </div>
        {devices.map(device =>
          <VolcaBass ref="bass" key="bass" webMidi={webMidi} playing={playing} tempo={tempo} />
        )}
      </div>
    )
  }

}

export default Rack
