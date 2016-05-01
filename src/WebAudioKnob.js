import React, { Component, PropTypes } from 'react'

class WebAudioKnob extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      value: props.log ? parseFloat(this.log2(props.initialValue)) : parseFloat(props.initialValue),
      valueOld: NaN // props.log ? parseFloat(this.log2(props.initialValue)) : parseFloat(props.initialValue)
    }

    this.digits = 0
    if (props.step && props.step < 1) {
      for(let n = step ; n < 1; n *= 10)
        ++this.digits;
    }

    this.minval = props.min
    this.maxval = props.max
    this.ctlStep = 1
    if (props.log) {
      if (this.minval == 0)
        this.minval = 0.001;
      // this.props.min = this.log2(this.minval);
      // this.props.max = this.log2(this.maxval);
      this.ctlStep = this.log2(props.step);
      if (this.ctlStep == 0)
        this.ctlStep = 0.0001;
    } else{
      this.ctlStep = props.step
    }

    this.lastShift = null
    this.startPosX = null
    this.startPosY = null
    this.startVal = 0
    this.ttflag = 0
    this.vtflag = 0
    this.press = 0
  }

  log2(num) {
    return Math.log(num) / Math.LN2
  }

  pointerdown(e) {
    const { value } = this.state
    const { enable } = this.props
    const { defaultValue } = this.getDimensions()

    if (!enable) return;
    if (e.touches) e = e.touches[0];
    this.boundPointermove = WebAudioKnob.pointermove.bind(this);
    this.boundCancel = WebAudioKnob.cancel.bind(this);
    if(e.ctrlKey || e.metaKey) {
      this.setValue(parseFloat(defaultValue))
    } else {
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

  pointerover(e) {
    let btn = (typeof(e.buttons) !== "undefined") ? e.buttons : e.which
    if (btn==0) this.ttflag = 1
    // setTimeout(this.showtip.bind(this),700);
  }

  pointerout(e) {
    this.ttflag = 0;
    if (this.press == 0) this.vtflag = 0;
    // this.showtip();
  }

  wheel(e) {
    const { value } = this.state
    const { min, max, step } = this.props

    let delta = 0;
    if (!e)
      e = window.event;
    if (e.wheelDelta)
      delta = e.wheelDelta/120;
    else if(e.detail)
      delta = -e.detail/3;
    if(e.shiftKey)
      delta *= 0.2;
    delta *= (max - min) * 0.05;
    if(Math.abs(delta) < step)
      delta = (delta>0)?step:-step;
    if(this.setValue(value+delta)) {
      // this.fire('change');
    }
    this.ttflag = 0;
    this.vtflag = 1;
    // this.showtip();
    e.preventDefault();
  }

  componentDidMount() {
    const { value } = this.state
    const { diameter, step, min, max, log } = this.props
    const dimensions = this.getDimensions()

    const knb = this.refs['wac-knob'];
    knb.addEventListener('DOMMouseScroll',this.wheel.bind(this),false);
    knb.addEventListener('mousewheel',this.wheel.bind(this),false);
    knb.addEventListener('mouseover',this.pointerover.bind(this),false);
    knb.addEventListener('mouseout',this.pointerout.bind(this),false);



    knb.style.width = dimensions.width+'px';
    knb.style.height = dimensions.height+'px';
    knb.style.background = dimensions.background
    knb.style.backgroundSize = '100% '+((dimensions.sprites+1)*100)+'%'

    // FIXME: have to change slider rotation here to make it work on mount with sprites, strange
    const range = max - min;
    if (dimensions.sprites) {
      const offset = ~~(dimensions.sprites * (value - min) / range) * dimensions.height;
      knb.style.backgroundPosition = "0px -" + offset + "px"
      knb.style.transform = 'rotate(0deg)'
    }
    this.setState({
      value: value
    })
    // else {
    //   let deg = 270*((value-min)/range-0.5);
    //   knb.style.transform = 'rotate('+deg+'deg)'
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.state.value) {
      this.setState({
        value: nextProps.initialValue
      })
    }
  }

  setValue(value) {
    const { valueOld } = this.state
    const { min, max, log, onChange } = this.props

    value = parseFloat(value);
    if (!isNaN(value)) {
      value = value < min ? min : value > max ? max : value;
      this.setState({
        value: value,
        valueOld: value
      })
    }
    onChange(value) // fire change
    return value != valueOld
  }

  getDimensions() {
    const defaultValue = this.props.defaultValue === null ? this.props.initialValue : this.props.defaultValue
    const width = this.props.width === null ? this.props.diameter : this.props.width
    const height = this.props.height === null ? this.props.diameter : this.props.height
    const sprites = this.props.src ? this.props.sprites : 0
    const background = this.props.src
                     ? 'url(' + this.props.src + ')'
                     : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACg0lEQVR42u2bvW7CMBCAwwswMCB14AUQb8BjsHbKUqljngClW16gUxkYeQXmTrRTXqEjTCiiGYJ7iS5SlAZIgu98wbH0CWTxc3ex785n23Ho2wRYAD6wAXbADxABCRJh3w4/4+N3Jk5H2xwIgBBQdxLib82lKz0EPE1KXzOGh/8lSnEfh3FtZcbAMzJubogI/9O4IV6BQ9MnOQW+gWgwyPgCpu1GxAFlYG8zYNt2KL+Bwkd4PSNH7LtjamxRJpbmouduLfAKiAGFxNh3p39IUDbSFuhwZkQGyAmolF/r8uapsr8w5HMDpO9XeqPFWrfyG53h7AMUjgs+IMY+zSFzI+7JV02Bs/4poHUkBARCUfsAbT7BpcroilNA0U2BIm6bOJ9QCVSeAgROsCpENsoTtoTCZE+7HAWIR0CeLNVObxW1ARiiQBU30+Zhm9xecBSoWjtcXUD5DEKod+BUGAEn7HN48K89/YhDiBdgXwiDe+xjMkB0aRR4TAKoJ2AJfCJL7HP48KoMEDIKoEbADBnxKp9Xlv7V8JRlzMlTXuEExoa/EMJi3V5ZSrbvsLDYAAu25EcovvZqT8fIqkY7iw2Q6p5tStpqgFR3nvxfKKnudJWfDpD0BuinQO8E+zBofSJkfSps/WLI+uWw9QWRviTWF0Xtmwah0Y0RAXhGt8YE5P9Do5ujEpIfo9vjBrm5Pc5yQMIgtc8Vbx9Q+dpHZMgPSRmq/DQ+TO0+kAFaH6IOHi3lFXFUlhFth6a7WDXSdli6iyNB+3H5LvkEsgsTxeiQCA115FdminmCpGSJ9dJUOW02uXYwdm2uvIBqfHFSw5JWxMXJsiGsvDpb1ay8PH2pib4+/wcnUdJ/bu6siQAAAABJRU5ErkJggg==)'

    return {
      defaultValue,
      width,
      height,
      sprites,
      background
    }
  }

  render() {
    const { value } = this.state
    const { units, min, max, log } = this.props
    const dimensions = this.getDimensions()
    const tooltip = "JAJA"

    // Turn the knob
    let knobStyle = {}
    const range = max - min;
    if (dimensions.sprites) {
      const offset = ~~(dimensions.sprites * (value - min) / range) * dimensions.height;
      knobStyle = {
        backgroundPosition: "0px -" + offset + "px",
        transform: 'rotate(0deg)'
      }
    }
    else {
      const deg = 270*((value-min)/range-0.5);
      knobStyle = {
        transform: 'rotate('+deg+'deg)'
      }
    }

    let valueNumber = (log) ? Math.pow(2, value) : value;
    let valuedisp = valueNumber.toFixed(this.digits);
    if ((this.digits==0) && (valueNumber>1000)) {
      valueNumber = valueNumber/1000;
      // between 1k and 10k - show two digits, else show one
      valuedisp = valueNumber.toFixed((valueNumber<10)?2:1) + "k";
    }
    // console.log('render value', value, 'valuedisp', valuedisp, 'valueNumber', valueNumber, knobStyle, dimensions)

    return (
      <div className="wac-container" ref="wac-container"
        onMouseDown={(ev) => this.pointerdown(ev)}
        onTouchStart={(ev) => this.pointerdown(ev)}>
        <div className="wac-body" touch-action="none">
          <div className="wac-knob" ref="wac-knob" touch-action="none" style={knobStyle}></div>
          <span className="wac-value-tip">{valuedisp}{units}</span>
          <div className="wac-tooltip-box">
            <span className="wac-tooltip-text">{tooltip}</span>
          </div>
        </div>
      </div>
    )
  }
}

WebAudioKnob.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  initialValue: PropTypes.number,
  defaultValue: PropTypes.number,
  step: PropTypes.number,
  diameter: PropTypes.number,
  sprites: PropTypes.number,
  onChange: PropTypes.func
}

WebAudioKnob.defaultProps = {
  initialValue:   0,
  defaultValue:   null,
  units:      "",
  log:        false,
  min:        0,
  max:        100,
  width:      null,
  height:     null,
  diameter:   64,
  step:       1,
  sprites:    0,
  enable:     true,
  src:        null,
  sensitivity:1,
  valuetip:   1,
  onChange:   function(val){}
}

WebAudioKnob.pointermove = function(e) {
  const { value } = this.state
  const { min, max, sensitivity } = this.props

  if(e.touches)
    e = e.touches[0];
  if(this.lastShift !== e.shiftKey) {
    this.lastShift = e.shiftKey;
    this.startPosX = e.pageX;
    this.startPosY = e.pageY;
    this.startVal = value;
  }
  const offset = (this.startPosY - e.pageY - this.startPosX + e.pageX) * sensitivity;

  // Not MY magic :p
  const newValue = min + ((((this.startVal + (max - min) * offset / ((e.shiftKey ? 4:1) * 128)) - min) / this.ctlStep)|0) * this.ctlStep
  this.setValue(newValue)
  e.preventDefault();
};

WebAudioKnob.cancel = function(e) {
  this.press = this.vtflag = 0;
  // this.showtip();
  this.startPosX = this.startPosY = null;
  window.removeEventListener('mousemove', this.boundPointermove, true);
  window.removeEventListener('touchmove', this.boundPointermove, true);
  window.removeEventListener('mouseup', this.boundCancel, true);
  window.removeEventListener('touchend', this.boundCancel, true);
  window.removeEventListener('touchcancel', this.boundCancel, true);
};

export default WebAudioKnob
