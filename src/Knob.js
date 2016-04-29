import React, { Component, PropTypes } from 'react'

class Knob extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: props.defaultValue
    }
    // var isStartMove = false, knob, lBar, rBar, pos, center;
    this.isStartMove = false
    this.pos = 0
    this.center = 0
  }

  componentDidMount() {
    this.calculateKnobPosition()
  }

  calculateKnobPosition() {
    let knob = this.refs.knob
    if (knob) {
      this.pos = this.findPos(knob);//find position of the element on the page
      this.center = {X: this.pos.X + knob.offsetWidth / 2, Y: this.pos.Y + knob.offsetHeight / 2}; //calculate center of the knob (and control itself)
      this.displayProgress(0); //display progress at 0 degree from start
    }
  }

  //calculates control's position related to top left corner of the page
  findPos(obj) {
    let curleft = 0
    let curtop = 0
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft
        curtop += obj.offsetTop
      } while (obj = obj.offsetParent)
    }
    return {X: curleft, Y: curtop}
  }

  //user touch the knob
  onKnobTouchStart(e){
    if (!e) var e = window.event
    this.isStartMove = true
  }

  //user is moving his finger (mouse), so do update UI accordingly
  onKnobTouchMove(e){
    if (!e) var e = window.event
    if(this.isStartMove) {
      var a = Math.atan2((e.pageY - this.center.Y), (e.pageX - this.center.X)) * 180 / Math.PI //calculate angle
      var b = (a >= 90 ? a - 90 : 270 + a) - 30 //shift angle, so 0 will be on the same place as usual 270
      this.displayProgress(b)
    }
  }
  
  //user removed finger from screen (mouseup event on desktop)
  onKnobTouchEnd(e){
    if (!e) var e = window.event
    this.isStartMove = false
  }

  //rotate progress bar to a given angle
  displayProgress(a){
    const progressBar = this.refs['progressBar']
    const lBar = this.refs['lBar']
    const rBar = this.refs['rBar']

    if (a >= 0 && a <= 180) {
      progressBar.style.clip ="rect(0px, 140px, 280px, 0px)";//show left part of the progress bar
      progressBar.style.webkitTransform ="rotate(30deg)";
      lBar.style.webkitTransform = "rotate(" + -1 * (180 - a)  + "deg)";    
      rBar.style.display = "none";    
    }
    else if(a > 180 && a < 300){
      progressBar.style.clip ="rect(0px, 280px, 280px, 0px)";//show right part of the progress bar
      rBar.style.display = "block"; //show right part of the progress bar
      lBar.style.webkitTransform = "rotate(0deg)"; //left part of the progress bar is static until user make volume lower than a half
      rBar.style.webkitTransform = "rotate(" + a + "deg)";
    }
  }

  render() {
    return (
      <div class="volume">
        <div id="volume-knob" ref="knob"
            onTouchStart={(ev) => this.onKnobTouchStart(ev.nativeEvent)}
            onTouchMove={(ev) => this.onKnobTouchMove(ev.nativeEvent)}
            onTouchEnd={(ev) => this.onKnobTouchEnd(ev.nativeEvent)}
            onMouseDown={(ev) => this.onKnobTouchStart(ev.nativeEvent)}
            onMouseMove={(ev) => this.onKnobTouchMove(ev.nativeEvent)}
            onMouseUp={(ev) => this.onKnobTouchEnd(ev.nativeEvent)}>
        </div>
        <div id="progress-bar" ref="progressBar">
          <div id="l-bar" ref="lBar">
          </div>
          <div id="r-bar" ref="rBar">
          </div>
        </div>
      </div>
    )
  }
}

export default Knob

