import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class Keyboard extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      octave: 1,
      holdNote: false
    }
  }

  playNote(note) {
    const { webMidi, playNote } = this.props
    const { holdNote } = this.state

    // console.log("playNote " + note + octave)
    if (holdNote != note) {
      playNote(note)
    }
    // webMidi.playNote(note, 1)
  }

  stopNote(note) {
    const { webMidi, stopNote } = this.props
    const { holdNote } = this.state

    // console.log("stopNote " + note + octave)
    if (holdNote != note) {
      // webMidi.stopNote(note)
      stopNote()
    }

  }

  toggleNote(note) {
    const { webMidi } = this.props
    const { holdNote } = this.state

    this.setState({
      holdNote: holdNote == note ? false : note
    })

    if (holdNote == note) {     // release
      webMidi.stopNote(note)
    } else {
      if (holdNote) {           // release prev
        webMidi.stopNote(holdNote)
      }
      webMidi.playNote(note, 1) // hold new note
    }
  }

  changeOctave(event) {
    const { octave } = this.state
    const newOctave = parseInt(event.target.value)

    this.setState({
      octave: newOctave
    })
  }

  render() {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    const { octave, holdNote } = this.state

    return (
      <ul id="keyboard">
        <li>
          <input type="number" step="1" min="0" max="6" value={octave} 
                 onChange={(event) => this.changeOctave(event)} />
        </li>
        {notes.map(note =>
          <li className={classnames({
                hold: note + octave == holdNote
              })}
              key={note}
              onMouseUp={() => this.toggleNote(note + octave)}
              // onMouseUp={() => this.props.stopNote()}
              onMouseEnter={() => this.props.playNote(note + octave, 0.9)}
              onMouseOut={() => this.stopNote(note + octave)}>
              {note}
          </li>
        )}
      </ul>
    )
  }

}

export default Keyboard
