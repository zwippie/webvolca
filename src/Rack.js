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
      tempo: 120
    }
    this.createPlaypackWorker()
  }

  createPlaypackWorker() {
    if (this.playbackWorker) {
      this.playbackWorker.postMessage({'cmd': 'stop', 'msg': 'Bye'})
    }
    this.playbackWorker = new PlaybackWorker()
    this.playbackWorker.addEventListener('message', function(e) {
      console.log(e.data)
    }, false)
  }

  play() {
    this.setState({
      playing: true
    })
    this.createPlaypackWorker()
    this.playbackWorker.postMessage({
      cmd: 'start',
      tempo: this.state.tempo
    })
  }

  stop() {
    this.setState({
      playing: false
    })
    this.playbackWorker.postMessage({'cmd': 'stop', 'msg': 'Bye'})
  }

  changeTempo(bpm) {
    this.setState({
      tempo: bpm
    })
  }

  schedule() {
    // while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    //   scheduleNote( current16thNote, nextNoteTime );
    //   nextNote();
    // }
  }

  render() {
    const { playing, tempo } = this.state
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
        <VolcaBass ref="bass" webMidi={webMidi} playing={playing} tempo={tempo} />
      </div>
    )
  }

}

export default Rack
