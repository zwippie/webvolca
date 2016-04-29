import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class Slider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: props.defaultValue
    }
  }

  setValue(val) {
    this.setState({
      value: val
    })
    this.props.onChange(val)
  }

  render() {
    const { value } = this.state
    const { min, max, step, size } = this.props
    const normalizedValue = (value - min) / (max - min) * 100
    const backgroundStyle = "linear-gradient(to right, red " + normalizedValue + "%, white " + normalizedValue + "%)"

    return (
      <div className="slider">
        <input className={size} type="range" min={min} max={max} step={step} value={value} data-value={value}
            onChange={(ev) => this.setValue(ev.target.value)}
            style={{background: backgroundStyle}} />
      </div>
    )
  }
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  size: '' // or small
}

export default Slider
