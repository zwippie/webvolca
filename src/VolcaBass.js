import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import Keyboard from './Keyboard'
import Sequencer from './Sequencer'

class VolcaBass extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      notePlaying: false,
      notePlayingLength: undefined,
      midiDevice: undefined,
      midiChannel: '1'
    }
  }

  /* Play a note. If length is given, playNote and stopNote events will be
    added to the MIDI stream. If no length is given the note will play
    until a stopNote is called or until a new playNote is called. */
  playNote(note, velocity = 1.0, length = undefined) {
    const { midiDevice, midiChannel, notePlaying, notePlayingLength } = this.state
    const { webMidi } = this.props
    console.log("VolcaBass Play Note:", note, velocity, length)
    
    // Play midi notes with undefined length, the volca bass likes that
    console.log('playNote', note, length)
    webMidi.playNote(note, velocity, undefined, midiDevice, midiChannel)
    if (length !== undefined) {
      webMidi.stopNote(note, 0.5, midiDevice, midiChannel)
    } else {
      // only save notes with undefined length
      this.setState({
        notePlaying: note,
        notePlayingLength: undefined
      })
    }
    // Stop previous note if length was undefined
    if (notePlaying && notePlaying != note && notePlayingLength === undefined) {
      webMidi.stopNote(notePlaying, 0.5, midiDevice, midiChannel)
    }

  }

  /* Stop the last note that was played with undefined length, or 
    stop a specific note if argument is given. */
  stopNote(note = undefined) {
    const { midiDevice, midiChannel, notePlaying } = this.state
    const { webMidi } = this.props

    if (note === undefined) {
      note = notePlaying
    }

    console.log('stop note', note)
    if (note) {
      webMidi.stopNote(note, 0.5, midiDevice, midiChannel)
      this.setState({
        notePlaying: false,
        notePlayingLength: undefined
      })
    }
  }

  scheduleEvents(beatNumber, time) {
    const { midiDevice, midiChannel } = this.state

    this.refs['sequencer'].scheduleEvents(beatNumber, time, midiDevice, midiChannel)
  }

  setMidiDevice(deviceId) {
    const { webMidi } = this.props
    let device = webMidi.outputs.find(device => device.id == deviceId)
    this.setState({
      midiDevice: device
    })
  }

  setMidiChannel(channel) {
    this.setState({
      midiChannel: channel
    })
  }

  render() {
    const { midiDevice, midiChannel } = this.state
    const { webMidi, playing, tempo } = this.props
    const channels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    const devices = [{ id: undefined, name: 'All' }].concat(
      webMidi.outputs.map(device => ({ id: device.id, name: device.name }))
    )
    // console.log("Devices:", devices, 'selected:', midiDevice)

    return (
      <div>
        <h2>Bass</h2>
        <div>
          <label>
            Device
            <select value={midiDevice ? midiDevice.id : midiDevice} 
              onChange={(ev) => this.setMidiDevice(ev.target.value)}>
              {devices.map(device =>
                <option key={"midiDevice"+device.id} value={device.id}>{device.name}</option>
              )}
            </select>
          </label>
          <label>
            Midi Channel
            <select value={midiChannel} 
              onChange={(ev) => this.setMidiChannel(ev.target.value)}>
              {channels.map(channel =>
                <option key={"midiChannel"+channel} value={channel}>{channel}</option>
              )}
            </select>
          </label>
        </div>
        <Keyboard ref="keyboard"
          webMidi={webMidi}
          midiDevice={midiDevice}
          midiChannel={midiChannel}
          playNote={(...args) => this.playNote(...args)}
          stopNote={(...args) => this.stopNote(...args)} />
        <Sequencer ref="sequencer" 
          webMidi={webMidi}
          midiDevice={midiDevice}
          midiChannel={midiChannel}
          playing={playing} 
          tempo={tempo} 
          playNote={(...args) => this.playNote(...args)} />
      </div>
    )
  }
}

export default VolcaBass
