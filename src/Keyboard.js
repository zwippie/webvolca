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
    const { playNote } = this.props
    const { holdNote } = this.state

    console.log("keyboard playNote " + note)
    if (holdNote != note) {
      playNote(note)
    }
  }

  stopNote(note) {
    const { stopNote } = this.props
    const { holdNote } = this.state

    console.log("keyboard stopNote " + note)
    if (holdNote != note) {
      stopNote(note)
    }
  }

  toggleNote(note) {
    const { playNote, stopNote } = this.props
    const { holdNote } = this.state

    console.log("keyboard toggleNote", note)
    this.setState({
      holdNote: holdNote == note ? false : note
    })

    if (holdNote == note) {     // release
      stopNote(note)
    } else {
      if (holdNote) {           // release prev
        stopNote(holdNote)
      }
      playNote(note, 1) // hold new note
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
    const { octave, holdNote } = this.state
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    return (
      <ul id="keyboard">
        <li>
          <label>
            Octave
            <input type="number" step="1" min="0" max="6" value={octave} 
                  onChange={(event) => this.changeOctave(event)} />
          </label>
        </li>
        {notes.map(note =>
          <li className={classnames({
                note: true,
                hold: note + octave == holdNote
              })}
              key={note}
              onMouseUp={() => this.toggleNote(note + octave)}
              onMouseEnter={() => this.playNote(note + octave, 0.9)}
              onMouseOut={() => this.stopNote(note + octave)}>
              {note}
          </li>
        )}
      </ul>
    )
  }

}

export default Keyboard
