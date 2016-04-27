import React, { Component, PropTypes } from 'react'

import VolcaBass from './VolcaBass'
import PlaybackWorker from 'worker!./PlaybackWorker'
// let PlaybackWorker = require('worker!./PlaybackWorker')

class Rack extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      playing: false,
      position: 0,
      tempo: 120.0,
      devices: [{type: 'VolcaBass'}],
      startTime: 0.0,
      // current16thNote: 0,
      // nextNoteTime: 0.0,
      lookahead: 25.0,
      scheduleAheadTime: 100.0
    }
    this.current16thNote = 0.0
    this.nextNoteTime = 0.0
    // this.lookahead = 25.0
    // this.scheduleAheadTime = 100.0
    this.createPlaypackWorker()
  }

  createPlaypackWorker() {
    // if (this.playbackWorker) {
    //   this.playbackWorker.postMessage({'cmd': 'stop', 'msg': 'Bye'})
    // }
    // this.playbackWorker = new PlaybackWorker()
    // this.playbackWorker.addEventListener('message', function(e) {
    //   console.log(e.data)
    // }, false)
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

  play() {
    const { webMidi } = this.props
    
    this.current16thNote = 0
    this.nextNoteTime = webMidi.time
    this.playbackWorker.postMessage("start");
    this.setState({
      playing: true
    })
  }

  stop() {
    this.playbackWorker.postMessage("stop");
    this.setState({
      playing: false
    })
  }

  changeTempo(bpm) {
    this.setState({
      tempo: bpm
    })
  }

  scheduler() {
    // const { nextNoteTime, current16thNote, scheduleAheadTime } = this.state
    const { webMidi } = this.props
    console.log('scheduler called', webMidi.time, this.nextNoteTime, this.current16thNote)

    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.nextNoteTime < webMidi.time + this.state.scheduleAheadTime ) {
      console.log('scheduler while', webMidi.time, this.nextNoteTime, this.current16thNote)
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  scheduleNote(beatNumber, time) {
    const { devices, tempo } = this.state
    const { webMidi, scheduleAheadTime } = this.props
    let currentNoteStartTime = webMidi.time
    console.log('scheduleNote called', beatNumber, time, webMidi.time)

    const bass = this.refs['bass']
    // console.log(bass)
    let duration = 60.0 / tempo * 1000 / 8;
    webMidi.playNote('C3', 1.0, undefined, undefined, 'all', time)
    webMidi.stopNote('C3', 0.5, undefined, 'all', time + duration)
    console.log(beatNumber, 'NOTE scheduled from ', time, 'to', time + duration)
  }

  nextNote() {
    const { tempo } = this.state

    // Advance current note and time by a 16th note...
    let secondsPerBeat = 60.0 / tempo;  // picks up the CURRENT tempo value!
    
    this.nextNoteTime += (0.25 * secondsPerBeat * 1000),  // Add 1/4 of quarter-note beat length to time,
    this.current16thNote = (this.current16thNote + 1) % 16  // Advance the beat number, wrap to zero
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState)
  // }

  render() {
    const { playing, tempo, devices } = this.state
    const { webMidi } = this.props

    return (
      <div>
        <div id="master-controls">
          <input type="number" value={tempo}
            onChange={(event) => this.changeTempo(event.target.value)} />
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
