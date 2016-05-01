import React, { Component, PropTypes } from 'react'

class WebAudioSlider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: props.initialValue,
      valueOld: props.initialValue
    }

    // Used for event handling
    this.press = 0
    this.hover = 0
    this.ttflag = 0
    this.lastShift = null
    this.startPosX = null
    this.startPosY = null
    this.startVal = 0
  }

  componentDidMount() {
    var slib = this.refs['wac-slibase']
    var slik = this.refs['wac-sliknob']

    slib.addEventListener('DOMMouseScroll', this.wheel.bind(this), false)
    slib.addEventListener('mousewheel', this.wheel.bind(this), false)
    slib.addEventListener('mouseover', this.pointerOver.bind(this), false)
    slib.addEventListener('mouseout', this.pointerOut.bind(this), false)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.initialValue) {
      // this.setState({
      //   value: nextProps.initialValue
      // })
      this.setValue(nextProps.initialValue)
    }
  }

  pointerDown(e) {
    const { value } = this.state
    const { enable, defaultValue } = this.props

    if (!enable) return
    if (e.touches) e = e.touches[0]
    this.boundPointermove = WebAudioSlider.pointerMove.bind(this)
    this.boundCancel = WebAudioSlider.cancel.bind(this)
    if (e.ctrlKey || e.metaKey) {
      this.setValue(defaultValue)
    }
    else {
      // if (this.valuetip) this.$['wac-value-tip'].style.opacity = 0.8;
      this.startPosX = e.pageX;
      this.startPosY = e.pageY;
      this.startVal = value;
      window.addEventListener('mousemove', this.boundPointermove, true);
      window.addEventListener('touchmove', this.boundPointermove, true);
    }
    window.addEventListener('mouseup', this.boundCancel, true);
    window.addEventListener('touchend', this.boundCancel, true);
    window.addEventListener('touchcancel', this.boundCancel, true);
    this.press = this.vtflag = 1;
    this.ttflag = 0;
    // this.showtip();
    e.preventDefault();
  }

  pointerOver(e) {
    const btn = (typeof(e.buttons) !== "undefined") ? e.buttons : e.which
    if (btn == 0) this.ttflag = 1
    // setTimeout(this.showtip.bind(this),700);
  }

  pointerOut(e) {
    this.ttflag = 0;
    if (this.press == 0) this.vtflag = 0;
    // this.showtip();
  }

  wheel(e) {
    const { value } = this.state
    const { min, max, step } = this.props
    let delta = 0
    if (!e) e = window.event

    if (e.wheelDelta) delta = e.wheelDelta / 120
    else if(e.detail) delta = -e.detail / 3
    if (e.shiftKey) delta *= 0.2
    delta *= (max - min) * 0.05
    if (Math.abs(delta) < step)
      delta = (delta > 0) ? step : -step

    this.setValue(value + delta)
    this.ttflag = 0
    this.vtflag = 1
    // this.showtip()
    e.preventDefault()
  }

  setValue(value) {
    const { valueOld } = this.state
    const { min, max, onChange } = this.props
    value = parseFloat(value);
    if (!isNaN(value)) {
      value = value < min ? min : value > max ? max : value
console.log('slider changeValue', valueOld, 'to', value)
      this.setState({
        value: value,
        valueOld: value
      })
    }
    if (value != valueOld) onChange(value) // fire change
  }

  getDimensions() {
    const width       = this.props.width == 0
                      ? (this.props.direction == 'horizontal' ? 128 : 24)
                      : this.props.width
    const height      = this.props.height == 0
                      ? (this.props.direction == 'horizontal' ? 24 : 128)
                      : this.props.height
    const knobWidth   = this.props.knobWidth == 0
                      ? (this.props.direction == 'horizontal' ? height : width)
                      : this.props.knobWidth
    const knobHeight  = this.props.knobHeight == 0
                      ? (this.props.direction == 'horizontal' ? height : width)
                      : this.props.knobHeight
    const ditchLength = this.props.ditchLength == 0
                      ? (this.props.direction == 'horizontal' ? width - knobWidth : height - knobHeight)
                      : this.props.ditchLength

    let digits = 1
    if (this.props.step && this.props.step < 1) {
      for (let n = this.props.step ; n < 1; n *= 10)
        ++digits
    }

    return {
      width,
      height,
      knobWidth,
      knobHeight,
      ditchLength,
      digits
    }
  }

  render() {
    const { value } = this.state
    const { min, max, step, direction, units, tooltip } = this.props
    const dimensions = this.getDimensions()

    const baseStyle = {
      width: dimensions.width + 'px',
      height: dimensions.height + 'px',
      background: this.props.src ? 'url(' + this.props.src + ')' : '#000',
      borderRadius: this.props.src ? '' : '8px',
      backgroundSize: '100% 100%',
    }
    let knobStyle = {
      width: dimensions.knobWidth + 'px',
      height: dimensions.knobWidth + 'px',
      background: 'url('+ this.props.knobSrc + ')',
      left: dimensions.width / 2 - dimensions.knobWidth / 2 + 'px',
      top: dimensions.height / 2 - dimensions.knobHeight / 2 + 'px',
      backgroundSize: '100% 100%'
    }

    const range = max - min;
    if (direction == 'vertical') {
      const pos = (dimensions.height + dimensions.ditchLength - dimensions.knobHeight) * 0.5 - (value - min) / range * dimensions.ditchLength;
      knobStyle.top = pos + 'px'
    } else {
      const pos = (dimensions.width - dimensions.ditchLength - dimensions.knobWidth) * 0.5  + (value - min) / range * dimensions.ditchLength;
      knobStyle.left = pos + 'px'
    }
    const valuedisp = value.toFixed(dimensions.digits);

    return (
      <div className="wac-container" ref="wac-container"
        onMouseDown={(ev) => this.pointerDown(ev)}
        onTouchStart={(ev) => this.pointerDown(ev)}>
        <div class="wac-body">
          <div className="wac-slibase" ref="wac-slibase" touch-action="none" style={baseStyle}>
            <div className="wac-sliknob" ref="wac-sliknob" style={knobStyle}></div>
          </div>
          <span className="wac-value-tip">{valuedisp}{units}</span>
          <div className="wac-tooltip-box">
            <span className="wac-tooltip-text">{tooltip}</span>
          </div>
        </div>
      </div>
    )
  }

}

export default WebAudioSlider

WebAudioSlider.defaultProps = {
  direction: 'horizontal',
  width: 0,
  height: 0,
  sliderWidth: 0,
  sliderHeight: 0,
  knobWidth: 0,
  knobHeight: 0,
  ditchLength: 0,
  initialValue: 0,
  defaultValue: 0,
  src: null,
  knobSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEDElEQVR42u1XS0hVURQ9+YsUQxNrJloTwYEjcSbiSISIhGjWsLlIOBNHDgUDhw6CCJOwSEokwoQokTApTE1CNHnlJ7+Z/7da675z9fC67z4/NQh8sPB371lrr73P3ltjTj//0wfGnPtlTO2aMXdXjelfNubzD2KO33/j72b5Nz3zt0lTNo25smVMI7FCYIP4SVAEKAKLBEUgQkzxmUk+O8139O5JybN3jbm5Y8x7AnvE7pkz2CY2iXVi1QpYIL4TXwkKwATf+cR353nGccnzSdhKLIg4mpqK6NmzQHY2oufPYy8rC7v8eZ2/X6IQX0DkQABG+e4Iz2B68o8cuSXfiPJwjzgvDygsBIqLY7h8GcjPxx4FraWn4wefcwV8iQnAMM8gWg/thPIm2xW5yMFIUVAAlJcDV68CN24A164BlZVASQmiFy9iOzMTS3TCTYEv4APxjme95ZmHqgkVnHLu2a7IRV5VBdy+DTQ1Ac3NQEMDcOsWUFHhObGTm4sluhBXA64AvOGZH3l2UgGq9h2bc892RS7y1lagszOGtjagrg6orvbSscPnljMyMEvH4gUMHwjAK56d9J7rqu1Hr5zLdkUu4r4+oLcXaG8H7twBamo8AdsXLmCRAmYoYMraP06MOAJeEy95dmifUJPZsldN1e4Vm3Iu2yVA5F1dQEtLzBXWQbSoCJu8FXNpaYH2DxGDVsCL2NfahALU4dRkdM911TwBKjjlXLYrcpHX1wPXrwOlpdi7dAkrLMLvKSn70U/ERT9A9FsBT8mRUIDaqzqcmozuuXfVVO0qOOVctitykZeVeQW6QadmWYDTfCcoej//fQcC+hMKUG9XZ1OHU5PRPddV86pdBaecSxAjF/lmTg7m+dyMJQ/K/cBB/tFDPCZHQgEaLMu2x6vDqcnonntO2AaknMt2RS7yCK2fdKwPit63/xnxKEyAptqi7e1qr+pwajK657pqqnYVnHIu293IXfKg6HuJJ0RnWAo0UufsYBHUXtXh1GR0z3XVVO0quOkActf6wbjcK/ou4kFYEWqeR+xQiYeazIxtNFNOuw0j961X7rtj0ev72tBGpHn+1Q6ViG2tPuKJxwNsd8l967tjuVf0K0kXFi0Tk5YoHj6xG3UYuWt9RwyNSWeBNhktExOW0CUdDyAeSkJuCw/3eebzwwwjjUxtMlomRi3haAixX+1h5LR+4R7PbDrsiqblQZuMlokPDmki4tdOtff+Sb7xkGeNHXU10xqlTUbLxDuHdDCO2I3ar/YuJ3KRDx11JXOd0CajZcIn9En7HGI/ar/aO2zOZfvYcZdStya0yWiZ0Dx/YUn9iH27nahXVO0quKaTruVBfULzXCNVU02DRb1d7VUdrudf/GNy+vnXn98GjC4Yymnd5wAAAABJRU5ErkJggg==',
  tooltip: '',
  min: 0,
  max: 100,
  step: 1,
  sensitivity: 1,
  units: '',
  enable: true,
  onChange: function(){}
}

WebAudioSlider.pointerMove = function(e) {
  const { value } = this.state
  const { direction, min, max, sensitivity, step } = this.props
  const dimensions = this.getDimensions()

  if (e.touches) e = e.touches[0]
  if (this.lastShift !== e.shiftKey) {
    this.lastShift = e.shiftKey;
    this.startPosX = e.pageX;
    this.startPosY = e.pageY;
    this.startVal = value;
  }
  const offset = (direction == 'vertical')
               ? (this.startPosY - e.pageY) / dimensions.ditchLength
               : (e.pageX - this.startPosX) / dimensions.ditchLength

  this.setValue(min + ((((this.startVal + (max - min) * offset * sensitivity / ((e.shiftKey ? 4:1))) - min) / step)|0) * step)
  e.preventDefault()
}

WebAudioSlider.cancel = function(e) {
  this.press = this.vtflag = 0;
  // this.showtip();
  this.startPosX = this.startPosY = null;
  window.removeEventListener('mousemove', this.boundPointermove, true);
  window.removeEventListener('touchmove', this.boundPointermove, true);
  window.removeEventListener('mouseup', this.boundCancel, true);
  window.removeEventListener('touchend', this.boundCancel, true);
  window.removeEventListener('touchcancel', this.boundCancel, true);
};
