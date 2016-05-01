import React, { Component, PropTypes } from 'react'

class WebAudioSwitch extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: props.initialValue,
      valueOld: props.initialValue
    }
    this.press = 0
    this.hover = 0
    this.ttflag = 0
  }

  pointerdown(e) {
    const { value } = this.state
    const { enable, type, defaultValue } = this.props

    if (!enable) return;
    this.boundCancel = WebAudioSwitch.cancel.bind(this);
    this.boundUp = WebAudioSwitch.up.bind(this);
    window.addEventListener('mouseup', this.boundUp, true);
    window.addEventListener('touchend', this.boundUp, true);
    window.addEventListener('touchcancel', this.boundCancel, true);

    switch(type) {
    case 'kick':
      this.setValue(1);
      break;
    case 'toggle':
      if (e.ctrlKey || e.metaKey) {
        this.setValue(defaultValue)
      } else {
        this.setValue(1 - value)
      }
      break;
    case 'radio':
      this.setValue(1);
      break;
    }
    this.press = 1;
    this.ttflag = 0;
    this.showtip();
    e.preventDefault();
  }

  pointerover(e) {
    const btn = (typeof(e.buttons) !== "undefined") ? e.buttons : e.which
    if (btn == 0) {
      this.ttflag = 1
    }
    setTimeout(this.showtip.bind(this),700);
    this.hover = 1
    if (this.type=="kick" && this.press) {
      this.setValue(1)
    }
  }

  pointerout(e) {
    this.ttflag = 0
    if (this.press == 0) {
      this.vtflag = 0
    }
    this.showtip();
    this.hover = 0;
    if (this.type == "kick") {
      this.setValue(0)
    }
  }

  showtip() {
    const { tooltip } = this.props

    const ts = this.refs['wac-tooltip-box'].style;
    if (tooltip && this.ttflag) {
      ts.display = "block";
      setTimeout(function(){this.opacity=0.8;}.bind(ts),100);
    }
    else if (ts.opacity) {
      ts.opacity = 0;
      setTimeout(function(){this.display="none";}.bind(ts),500);
    }
  }

  click(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  setValue(value, fire) {
    const { valueOld } = this.state
    const { type, onChange, onClick } = this.props

    value = parseInt(value)

    // TODO: fix groupint?
    // var el = document.getElementsByTagName('webaudio-switch');
    // if(value == 1) {
    //   for(var i = 0, j = el.length; i < j; ++i) {
    //     if(this.group && el[i] != this && el[i].group == this.group)
    //       el[i].setValue(0);
    //   }
    // }

    this.setState({
      value: value,
      valueOld: value
    })
    // if (value != valueOld) // bug when linked to second switch that has value: 1-value
      onChange(value)
    if (type == 'kick' && value == 0) {
      onClick(value)
    }
  }

  componentDidMount() {
    const { value } = this.state
    const { width, height, src } = this.props

    var sw = this.refs['wac-switch']
    sw.addEventListener('mouseover',this.pointerover.bind(this),false);
    sw.addEventListener('mouseout',this.pointerout.bind(this),false);
    sw.addEventListener('click',this.click.bind(this),false);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.initialValue) {
      this.setState({
        value: nextProps.initialValue
      })
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.value !== nextState.value
  // }

  render() {
    const { value } = this.state
    const { width, height, src, tooltip } = this.props

    const switchStyle = {
      width: width + 'px',
      height: height + 'px',
      background: 'url('+src+')',
      backgroundPosition: '0px -' + (value * height) + 'px',
      backgroundSize: '100% 200%'
    }

    return (
      <div className="wac-container" ref="wac-container"
        onMouseDown={(ev) => this.pointerdown(ev)}
        onTouchStart={(ev) => this.pointerdown(ev)}>
        <div className="wac-body">
          <div className="wac-switch" ref="wac-switch" style={switchStyle}></div>
          <div className="wac-tooltip-box" ref="wac-tooltip-box">
            <span className="wac-tooltip-text">{tooltip}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default WebAudioSwitch

WebAudioSwitch.propTypes = {
  initialValue: PropTypes.number,
  defaultValue: PropTypes.number
}

WebAudioSwitch.defaultProps = {
  initialValue:   0,
  defaultValue:   0,
  type:       'toggle',
  width:      24,
  height:     24,
  src:        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAADiklEQVR42u2YzUtUURjG1Rn8mEHEhV+DK3E3q0EGXAq5EkLETYG4cOlioJWI6NqWLUTnH3ARUpJJyRQVWYqEWSAlJmRBkn0gIqTFnLfnvb5XTuOdr3Pv0Fhz4bfwznif5/06c+4pKyuyywfqQBhEPSYsz/alE68BnWACvAekoVL+zhclz5wQjRqnyPmDeXDosbjOoWh0pmaiTtwdphH22sSEaJ5dYYe055oFladpuxxh3UA0w4NVDvVNdz/TM6LZDBSatAaURz2gsjzTOAPK8LOClcC0R4q3B8ijFLs2oAyaLB/jeWUgl1nPN4Di7wFluAT/O1PgZRNenAwolyug50txLmX4a0vx/zsFKiX9Kofdk3JrQHm4V3Q04GZTavI/5zalTtvyQuG4Lc/2YqIMdr1O2Uj7YpLp1Ux5tBRnfDUripfT0lU6HyidD1yM8wE/uATGQRzMgFHQJZ8V7HygFsQArNMJ+AGQSzoAX8EnsAaGQNDr84EQ2ARJpqKCyO+nJDj2+SwT38E++Ah2wCJoyZ7N3DIQkoeq8nKiYJAoFCJqazuloYF+BgJ0AFO2gXdgS0w0u92U1krklnh9PVEkQtTXRzQ4SNTbS9TRQaqxkY4qK88Z2AA3QcCNgZik3YqcxYeHiaamiOJxorExop4eKxPHyMJnmLRLYBtYBVdNDfil4ayac9o5chZPJIgWF4kmJ0/vtbfTEQzuwcCuZOCNGFgBc+enIzcD3dLt3HBWvTntHDmLz84SjYwQdXdTsrWVvlVVnUX/FrwGL8Az8BBETQyMy6glbQNcc047R87i/f1E4TCdoDf28Z1dMWBHzwaWQQIMmBiIy5zzqHG3c8NZNee0I3IW/4X7XxD9rlb7V2Bd6v8YLIFrJgZmZJFhEzxq3O1WJlBzTjtHzuIfUHsW35aJealF/0DGMWZiYFRWOF5keM551LjbueG45nratyX1du05+keSfvz00RUTA12yvO5r8KjtybilE1/Ran9XpiBiOoZrsrjo2MJ2zTc1cf7+U+n8e+A2mM5zDP/41RrSxHZShO2oN7S0L4s4N96CrISX3ayEQWmiLQ1deN1B/L4mfh1Uuz2iaRETG5qoLvxcazhO+x0RvwGavDofaJaHrmqiHPETiTohJm9pkTd5fT4QkB+WOU10SYTn5f601Ly6kOcDflnbB2SFi8mcR5y3ZKXzgdL5QOl8IOv1G6BBOS3D5b9NAAAAAElFTkSuQmCC',
  enable:     1,
  group:      '',
  tooltip:    '',
  onChange:   function(){},
  onClick:    function(){}
}

WebAudioSwitch.cancel = function(e) {
  window.removeEventListener('mouseup', this.boundUp, true)
  window.removeEventListener('touchend', this.boundUp, true)
  window.removeEventListener('touchcancel', this.boundCancel, true)
  if (this.type == "kick"){
    this.setValue(0)
  }
  this.press = 0;
}

WebAudioSwitch.up = function(e) {
  const { value } = this.state
  const { type } = this.props

  window.removeEventListener('mouseup', this.boundUp, true);
  window.removeEventListener('touchend', this.boundUp, true);
  window.removeEventListener('touchcancel', this.boundCancel, true);
  if (type == "kick") {
    // if (this.setValue(0)) {
    //   this.fire('change')
    //   if (value == 0) {
    //     this.fire('click');
    //   }
    // }
    setValue(0)
  }
  this.press = 0;
  e.preventDefault();
  return false;
}
