import React, { Component, PropTypes } from 'react'

import Knob from './Knob'
import WebAudioKnob from './WebAudioKnob'
import WebAudioSwitch from './WebAudioSwitch'
import WebAudioSlider from './WebAudioSlider'

class WebAudioControls extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      sliderDirection: 0
    }
  }

  onKnobChange(val) {
    val = val.toFixed(0)
    console.log('onKnobChange', val)
  }

  render() {
    return (
      <div>
        <WebAudioKnob
            src="images/LittlePhatty.png" sprites={100}
            onChange={(val) => this.onKnobChange(val)}
            defvalue={64} max={127} step={1} diameter={64} tooltip="React Knob!" />
        <WebAudioKnob
            onChange={(val) => this.onKnobChange(val)}
            defvalue={64} max={127} step={1} diameter={64} tooltip="React Knob!" />
        <div style={{}}>
          <WebAudioKnob
              onChange={(val) => this.onKnobChange(val)}
              defvalue={50} max={100} step={1} diameter={32} tooltip="React Knob!" />
          <WebAudioKnob
              onChange={(val) => this.onKnobChange(val)}
              defvalue={5} min={5} max={10} step={1} diameter={32} tooltip="React Knob!" />
        </div>
        <WebAudioSwitch
            src="images/switch_toggle.png" height={56} width={56}
            onChange={(val) => this.setState({sliderDirection: val})}
            defvalue={this.state.sliderDirection} tooltip="React Switch!" />
        <WebAudioSwitch
            onChange={(val) => this.onKnobChange(val)}
            defvalue={this.state.sliderDirection} tooltip="React Switch!" />
        <WebAudioSlider
            onChange={(val) => this.onKnobChange(val)}
            defaultValue={50} tooltip="React Slider!" />
        <WebAudioSlider
            direction={this.state.sliderDirection ? 'horizontal' : 'vertical'}
            onChange={(val) => this.onKnobChange(val)}
            defaultValue={50} tooltip="React Slider!" />
      </div>
    )
  }
}

export default WebAudioControls
