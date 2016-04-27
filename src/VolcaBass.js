import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import Keyboard from './Keyboard'
import Sequencer from './Sequencer'

class VolcaBass extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      notePlaying: false
    }
  }

  playNote(note, velocity = 1, length = undefined) {
    const { notePlaying } = this.state
    const { webMidi } = this.props
console.log(note, velocity, length)
    
    webMidi.playNote(note, velocity, length)
    if (notePlaying && notePlaying != note) {
      webMidi.stopNote(notePlaying)
    }
    this.setState({
      notePlaying: note
    })
  }

  stopNote() {
    const { notePlaying } = this.state
    const { webMidi } = this.props

    if (notePlaying) {
      webMidi.stopNote(notePlaying)
      this.setState({
        notePlaying: false
      })
    }
  }

  onBpm(count) {
    
  }

  render() {
    const { webMidi, playing, tempo } = this.props

    return (
      <div>
        <Keyboard webMidi={webMidi} 
          playNote={(...args) => this.playNote(...args)}
          stopNote={() => this.stopNote()} />
        <Sequencer webMidi={webMidi} playing={playing} tempo={tempo} 
          playNote={(...args) => this.playNote(...args)} />
      </div>
    )
  }
}

export default VolcaBass
