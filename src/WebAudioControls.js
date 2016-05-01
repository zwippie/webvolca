import React, { Component, PropTypes } from 'react'

import Knob from './Knob'
import WebAudioKnob from './WebAudioKnob'
import WebAudioSlider from './WebAudioSlider'
import WebAudioSwitch from './WebAudioSwitch'
import WebAudioParam from './WebAudioParam'

class WebAudioControls extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      knob1Value: 40,
      sliderDirection: 0,
      sliderValue: 25
    }
  }

  onKnob1Change(val) {
    val = parseInt(val.toFixed(0))
    console.log('onKnob1Change', val)
    this.setState({
      knob1Value: val
    })
  }

  onKnobChange(val) {
    val = val.toFixed(0)
    console.log('onKnobChange', val)
  }

  onSliderDirectionChange(val) {
    // testing explicit callback handler vs inline setstate in render: both work
    console.log('onSliderDirectionChange', val)
    this.setState({
      sliderDirection: val
    })
  }

  render() {
    return (
      <div>
        <WebAudioKnob
            src="images/LittlePhatty.png" sprites={100}
            onChange={(val) => this.onKnob1Change(val)}
            initialValue={this.state.knob1Value}
            defaultValue={80}
            max={127} step={1} diameter={64}
            tooltip="React Knob!" />
        <WebAudioParam
            initialValue={this.state.knob1Value}
            onChange={(val) => this.onKnob1Change(val)} />
        <WebAudioKnob
            onChange={(val) => this.onKnobChange(val)}
            initialValue={10}
            defaultValue={64}
            max={127} step={1} diameter={64} tooltip="React Knob!" />
        <div style={{}}>
          <WebAudioKnob
              onChange={(val) => this.onKnobChange(val)}
              initialValue={50} max={100} step={1} diameter={32} tooltip="React Knob!" />
          <WebAudioKnob
              onChange={(val) => this.onKnobChange(val)}
              initialValue={5} min={5} max={10} step={1} diameter={32} tooltip="React Knob!" />
        </div>
        <WebAudioSwitch
            src="images/switch_toggle.png" height={56} width={56}
            onChange={(val) => this.onSliderDirectionChange(val)}
            initialValue={this.state.sliderDirection}
            tooltip="React Switch!" />
        <WebAudioSwitch
            onChange={(val) => this.setState({sliderDirection: 1 - val})}
            initialValue={1 - this.state.sliderDirection}
            tooltip="React Switch 2!" />
        <WebAudioSlider
            direction="horizontal"
            src="images/hsliderbody.png"
            knobSrc="images/hsliderknob.png"
            onChange={(val) => this.setState({sliderValue: val})}
            initialValue={this.state.sliderValue}
            defaultValue={50}
            tooltip="React Slider!"
            width={256} />
        <WebAudioParam
            initialValue={this.state.sliderValue}
            onChange={(val) => this.setState({sliderValue: val})} />
        <WebAudioSlider
            direction={this.state.sliderDirection ? 'horizontal' : 'vertical'}
            onChange={(val) => this.setState({sliderValue: val})}
            initialValue={this.state.sliderValue}
            defaultValue={100}
            tooltip="React Slider 2!" />
      </div>
    )
  }
}

export default WebAudioControls
