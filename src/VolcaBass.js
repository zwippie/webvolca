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

  /* Play or schedulde a note. If length is given, playNote and stopNote events will be
    added to the MIDI stream. If no length is given the note will play
    until a stopNote is called or until a new playNote is called. */
  playNote(note, velocity = 1.0, length = undefined, time = undefined) {
    const { midiDevice, midiChannel, notePlaying, notePlayingLength } = this.state
    const { webMidi } = this.props
    console.log("Bass Play Note:", note, velocity, length, time === undefined ? webMidi.time : time)

    // Play midi notes with undefined length, the volca bass likes that
    webMidi.playNote(note, velocity, undefined, midiDevice, midiChannel, time)
    if (length !== undefined) {
      webMidi.stopNote(note, 0.5, midiDevice, midiChannel, time === undefined ? undefined : time + length)
    } else {
      // only save notes with undefined length
      this.setState({
        notePlaying: note,
        notePlayingLength: undefined
      })
    }
  }

  /* Stop the last note that was played with undefined length, or
    stop a specific note if argument is given. */
  stopNote(note = undefined, time = undefined) {
    const { midiDevice, midiChannel, notePlaying } = this.state
    const { webMidi } = this.props

    if (note === undefined) {
      note = notePlaying
    }

    console.log('Bass stop note', note, time === undefined ? webMidi.time : time)
    if (note) {
      webMidi.stopNote(note, 0.5, midiDevice, midiChannel, time)
      this.setState({
        notePlaying: false,
        notePlayingLength: undefined
      })
    }
  }

  /* TODO: Ask 'all' input devices (or only the sequencer) for this bass device for input */
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
    const channels = ['all',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
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
          playNote={(...args) => this.playNote(...args)}
          stopNote={(...args) => this.stopNote(...args)} />
        <Sequencer ref="sequencer"
          playing={playing}
          tempo={tempo}
          playNote={(...args) => this.playNote(...args)}
          stopNote={(...args) => this.stopNote(...args)} />
      </div>
    )
  }
}

export default VolcaBass
