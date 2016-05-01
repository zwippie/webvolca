import React, { Component, PropTypes } from 'react'

class WebAudioParam extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: parseFloat(props.initialValue)
    }
  }

  setValue(value) {
    // if(e.target)
    //   e = e.target;
    // var f = eval(this.fconv);
    // var t = typeof(f);
    // if(this.fconv == null)
    //   this.$['param'].value = e.valuedisp;
    // else if(t == "object")
    //   this.$['param'].value = f[e.value];
    // else if(t == "function")
    //   this.$['param'].value = f(e.value);
    value = parseFloat(value)
    this.setState({
      value: value
    })
    this.props.onChange(value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.initialValue) {
      this.setState({
        value: nextProps.initialValue
      })
    }
  }

  render() {
    const { value } = this.state
    const { width, height, src, color, fontSize } = this.props
    const paramStyle = {
      width: width + 'px',
      height: height + 'px',
      background: 'url(' + src +')',
      backgroundSize: '100% 100%',
      color: color,
      fontSize: fontSize + 'px'
    }

    return(
      <input type="text" class="wac-param"
          style={paramStyle}
          value={value}
          onChange={(ev) => this.setValue(ev.target.value)} />
    )
  }
}

export default WebAudioParam

WebAudioParam.propTypes = {
  initialValue: PropTypes.number
}

WebAudioParam.defaultProps = {
  initialValue:   0,
  width:      24,
  height:     24,
  src:        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxUlEQVR42u3b0QmDMBQF0KygS3QYpxEncpxM1b5CAlZbKPSreSdwB7hHSb5uKe/PHFkia+T+51lbl7l8cabIFqkDFD+ntm7Tp/K3yD5g8XP21vXy5TOUPyK8/AlbovI92/HCqwkBar8Yl4Tle57dh3jqfnki05bvAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYESD+YSD+ZST+aSj+bM5w0nTWevpw08/kHlO6byrGkuCkAAAAASUVORK5CYII=',
  fontSize:   9,
  color:      '#ffffff',
  fconv:      null,
  onChange:   function(val){}
}
