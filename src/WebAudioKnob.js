import React, { Component, PropTypes } from 'react'



class WebAudioKnob extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: parseFloat(props.defvalue),
      valueold: NaN
    }

    this.defvalue = null
    this.sprites = props.sprites
    this.width = null
    this.height = null
    this.lastShift = null
    this.startPosX = null
    this.startPosY = null
    this.startVal = 0
    this.minval = 0
    this.maxval = 100
    this.digits = 0
    this.ctlStep = 1
    this.ttflag = 0
    this.vtflag = 0
    this.press = 0
  }

  log2(num) {
    return Math.log(num) / Math.LN2
  }

  pointerdown(e) {
    const { value } = this.state
    const { enable, defvalue } = this.props

    console.log('pointerdown')
    if (!enable) return;
    console.log('pointerdown Go')
    if (e.touches) e = e.touches[0];
    this.boundPointermove = WebAudioKnob.pointermove.bind(this);
    this.boundCancel = WebAudioKnob.cancel.bind(this);
    if(e.ctrlKey || e.metaKey) {
      this.setValue(parseFloat(defvalue))
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
    const { min, max, step, sensitivity } = this.props

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
    const { defvalue, diameter, src, step, min, max, log } = this.props

    if (this.defvalue === null)
      this.defvalue = defvalue
    if (this.width === null)
      this.width = diameter;
    if (this.height === null)
      this.height = diameter

    let knb = this.refs['wac-knob'];
    knb.addEventListener('DOMMouseScroll',this.wheel.bind(this),false);
    knb.addEventListener('mousewheel',this.wheel.bind(this),false);
    knb.addEventListener('mouseover',this.pointerover.bind(this),false);
    knb.addEventListener('mouseout',this.pointerout.bind(this),false);
    knb.style.width = this.width+'px';
    knb.style.height = this.height+'px';
    if(src)
      knb.style.background = 'url('+src+')';
    else {
      knb.style.background = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACg0lEQVR42u2bvW7CMBCAwwswMCB14AUQb8BjsHbKUqljngClW16gUxkYeQXmTrRTXqEjTCiiGYJ7iS5SlAZIgu98wbH0CWTxc3ex785n23Ho2wRYAD6wAXbADxABCRJh3w4/4+N3Jk5H2xwIgBBQdxLib82lKz0EPE1KXzOGh/8lSnEfh3FtZcbAMzJubogI/9O4IV6BQ9MnOQW+gWgwyPgCpu1GxAFlYG8zYNt2KL+Bwkd4PSNH7LtjamxRJpbmouduLfAKiAGFxNh3p39IUDbSFuhwZkQGyAmolF/r8uapsr8w5HMDpO9XeqPFWrfyG53h7AMUjgs+IMY+zSFzI+7JV02Bs/4poHUkBARCUfsAbT7BpcroilNA0U2BIm6bOJ9QCVSeAgROsCpENsoTtoTCZE+7HAWIR0CeLNVObxW1ARiiQBU30+Zhm9xecBSoWjtcXUD5DEKod+BUGAEn7HN48K89/YhDiBdgXwiDe+xjMkB0aRR4TAKoJ2AJfCJL7HP48KoMEDIKoEbADBnxKp9Xlv7V8JRlzMlTXuEExoa/EMJi3V5ZSrbvsLDYAAu25EcovvZqT8fIqkY7iw2Q6p5tStpqgFR3nvxfKKnudJWfDpD0BuinQO8E+zBofSJkfSps/WLI+uWw9QWRviTWF0Xtmwah0Y0RAXhGt8YE5P9Do5ujEpIfo9vjBrm5Pc5yQMIgtc8Vbx9Q+dpHZMgPSRmq/DQ+TO0+kAFaH6IOHi3lFXFUlhFth6a7WDXSdli6iyNB+3H5LvkEsgsTxeiQCA115FdminmCpGSJ9dJUOW02uXYwdm2uvIBqfHFSw5JWxMXJsiGsvDpb1ay8PH2pib4+/wcnUdJ/bu6siQAAAABJRU5ErkJggg==)';
      this.sprites = 0;
    }
    knb.style.backgroundSize = '100% '+((this.sprites+1)*100)+'%';
    if(step && step < 1) {
      for(var n = step ; n < 1; n *= 10)
        ++this.digits;
    }
    this.minval = min;
    this.maxval = max;
    if (log) {
      if (this.minval == 0)
        this.minval = 0.001;
      this.props.min = this.log2(this.minval);
      this.props.max = this.log2(this.maxval);
      this.setValue(this.log2(value));
      this.ctlStep = this.log2(step);
      if (this.ctlStep == 0)
        this.ctlStep = 0.0001;
    } else{
      this.setValue(value);
      this.ctlStep = step;
    }
    // this.fire('change');
  }

  setValue(value) {
    const { valueold } = this.state
    const { step, min, max, log, onChange } = this.props
    console.log('setValue', value)

    value = parseFloat(value);
    if (!isNaN(value)) {
      value = value < min ? min : value > max ? max : value;
      console.log('correctedValue', value)
      this.setState({
        value: value,
        valueold: value
      })
    }
    onChange(value) // fire change
    return value != valueold ? 1 : 0
  }

  render() {
    const { value } = this.state
    const { units, min, max, log } = this.props

    const tooltip = "JAJA"
    const range = max - min;
    let knobStyle = {}
    if(this.sprites) {
      let offset = ~~(this.sprites * (value - min) / range) * this.height;
      console.log('offset', offset)
      knobStyle = {
        backgroundPosition: "0px -" + offset + "px",
        transform: 'rotate(0deg)'
      }
    }
    else {
      let deg = 270*((value-min)/range-0.5);
      console.log('rotate to ', deg);
      knobStyle = {
        transform: 'rotate('+deg+'deg)'
      }
    }

    let valueNumber = (log) ? Math.pow(2, value) : value;
    let valuedisp = valueNumber.toFixed(this.digits);
    if ((this.digits==0)&&(valueNumber>1000)) {
      valueNumber = valueNumber/1000;
      // between 1k and 10k - show two digits, else show one
      valuedisp = valueNumber.toFixed((valueNumber<10)?2:1) + "k";
    }
    console.log('render value', value, 'valuedisp', valuedisp, 'valueNumber', valueNumber)

    return (
      <div className="wac-container" ref="wac-container"
        onMouseDown={(ev) => this.pointerdown(ev)}
        onTouchStart={(ev) => this.pointerdown(ev)}>
        <div className="wac-body" touch-action="none">
          <div className="wac-knob" ref="wac-knob" touch-action="none" style={knobStyle}></div>
          <span className="wac-value-tip">{valuedisp}{units}</span>
          <div className="wac-tooltip-box"><span className="wac-tooltip-text">{tooltip}</span></div>
        </div>
      </div>
    )
  }
}

WebAudioKnob.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number
}

WebAudioKnob.defaultProps = {
  defvalue:   0,
  units:      "",
  log:        false,
  offset:     0,
  min:        0,
  max:        100,
  diameter:   64,
  step:       1,
  sprites:    0,
  enable:     true,
  src:    null,
  sensitivity:1,
  valuetip:   1
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
  var offset = (this.startPosY - e.pageY - this.startPosX + e.pageX) * sensitivity;

  const newValue = min + ((((this.startVal + (max - min) * offset / ((e.shiftKey ? 4:1) * 128)) - min) / this.ctlStep)|0) * this.ctlStep
  console.log(value, newValue, min, max, this.startVal, offset, this.ctlStep)
  this.setValue(newValue)
  // this.setValue(min + ((((this.startVal + (max - min) * offset / ((e.shiftKey ? 4:1) * 128)) - min) / this.ctlStep)|0) * this.ctlStep)
    // this.fire('change');
    // this.props.onChange(value)
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
