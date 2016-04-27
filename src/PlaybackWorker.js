// onmessage = function(event) {
//   console.log('PlaybackWorker.onmessage', event)
// }

self.playing = false

self.addEventListener('message', function(e) {
  var data = e.data;
  console.log('WORKER MESSAGE RECEIVED: ', data)

  switch (data.cmd) {
    case 'start':
      postMessage('WORKER STARTED: ' + data.tempo);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg +
                             '. (buttons will no longer work)');
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  }
}, false);