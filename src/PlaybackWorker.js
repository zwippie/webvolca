// onmessage = function(event) {
//   console.log('PlaybackWorker.onmessage', event)
// }

// self.playing = false

// self.addEventListener('message', function(e) {
//   var data = e.data;
//   console.log('WORKER MESSAGE RECEIVED: ', data)

//   switch (data.cmd) {
//     case 'start':
//       postMessage('WORKER STARTED: ' + data.tempo);
//       self.playing = true
//       // setTimeout(function() {
//       //   self.postMessage('ON BPM')
//       // }, 500)
//       break;
//     case 'stop':
//       self.postMessage('WORKER STOPPED: ' + data.msg +
//                              '. (buttons will no longer work)');
//       self.playing = false
//       self.close(); // Terminates the worker.
//       break;
//     default:
//       self.postMessage('Unknown command: ' + data.msg);
//   }
// }, false);

var timerID=null;
var interval=100;

self.onmessage=function(e){
  if (e.data=="start") {
    console.log("starting");
    timerID=setInterval(function(){postMessage("tick");},interval)
  }
  else if (e.data.interval) {
    console.log("setting interval");
    interval=e.data.interval;
    console.log("interval="+interval);
    if (timerID) {
      clearInterval(timerID);
      timerID=setInterval(function(){postMessage("tick");},interval)
    }
  }
  else if (e.data=="stop") {
    console.log("stopping");
    clearInterval(timerID);
    timerID=null;
  }
};

postMessage('hi there');