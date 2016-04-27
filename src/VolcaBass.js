import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import Keyboard from './Keyboard'
import Sequencer from './Sequencer'

class VolcaBass extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      notePlaying: false,
      midiDevice: undefined,
      midiChannel: '1'
    }
  }

  playNote(note, velocity = 1, length = undefined) {
    const { midiDevice, midiChannel, notePlaying } = this.state
    const { webMidi } = this.props
    console.log("VolcaBass Play Note:", note, velocity, length)
    
    webMidi.playNote(note, velocity, length, midiDevice, midiChannel)
    if (notePlaying && notePlaying != note) {
      webMidi.stopNote(notePlaying, 0.5, midiDevice, midiChannel)
    }
    this.setState({
      notePlaying: note
    })
  }

  stopNote() {
    const { midiDevice, midiChannel, notePlaying } = this.state
    const { webMidi } = this.props

    if (notePlaying) {
      webMidi.stopNote(notePlaying, 0.5, midiDevice, midiChannel)
      this.setState({
        notePlaying: false
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
    console.log("Devices:", devices, 'selected:', midiDevice)

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
          stopNote={() => this.stopNote()} />
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
