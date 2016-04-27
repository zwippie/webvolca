/* Background webworker for a steady timer to provide ticks
  to schedule musical events. See Rack component. */
var timerID = null
var interval = 100

self.addEventListener('message', function(e) {
  if (e.data=="start") {
    console.log("starting")
    timerID = setInterval(function() {
      postMessage("tick")
    }, interval)
  }
  else if (e.data.interval) {
    interval = e.data.interval
    console.log("setting interval to:", interval)
    if (timerID) {
      clearInterval(timerID)
      timerID = setInterval(function() {
        postMessage("tick")
      }, interval)
    }
  }
  else if (e.data=="stop") {
    console.log("stopping")
    clearInterval(timerID)
    timerID = null
  }
})

postMessage('hi there, this is the PlaybackWorker speaking');
