import WebMidi from 'webmidi'
import React from 'react'
import ReactDOM from 'react-dom'

import Rack from './Rack'

console.log('hello')

WebMidi.enable(onSuccess, onFailure)

function onSuccess() {
  console.log("WebMidi enabled.")
  WebMidi.playNote('C2', 0.5, 100, undefined, 'all')
  WebMidi.playNote('D2', 0.75, 100, undefined, 'all', '+100')
  WebMidi.playNote('E2', 1, 100, undefined, 'all', '+200')
  WebMidi.playNote('C4', 1, 500, undefined, 'all', '+300')

  WebMidi.addListener(
    'noteon',
    function(e){ console.log(e); }
  );

  WebMidi.inputs.map(function(input) {
    console.log(input)
  })
  WebMidi.outputs.map(function(output) {
    console.log(output)
  })

  ReactDOM.render(
    <Rack webMidi={WebMidi} />,
    document.getElementById('rack')
  )
}

function onFailure(err) {
  console.log("WebMidi could not be enabled.", err)

  ReactDOM.render(
    <h1>Sorry, no webmidi available.</h1>,
    document.getElementById('rack')
  )
}
