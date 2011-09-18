var Omegle, lastSaid, om, start, time, waiter;
Omegle = require('omegle').Omegle;
time = function() {
  return new Date().getTime();
};
lastSaid = time();
om = new Omegle();
om.on('recaptchaRequired', function(key) {
  return console.log("Recaptcha Required: " + key);
});
om.on('gotMessage', function(msg) {
  var repeat;
  lastSaid = time();
  console.log("Got message: " + msg);
  repeat = function() {
    var sent;
    sent = "You said: " + msg;
    return om.send(sent, function(err) {
      return console.log(!err ? "Message sent: " + sent : "Error: " + err);
    });
  };
  om.startTyping;
  return setTimeout(repeat, 800);
});
om.on('strangerDisconnected', function() {
  console.log("Stranger disconnected");
  return start();
});
om.on('typing', function() {
  return console.log('Stranger started typing');
});
om.on('stoppedTyping', function() {
  return console.log('Stranger stopped typing');
});
start = function() {
  om.disconnect(function() {
    return console.log("disconnected\n");
  });
  return om.start(function() {
    console.log("connected with id " + om.id);
    return lastSaid = time();
  });
};
start();
waiter = function() {
  if (time() - lastSaid > 20 * 1000) {
    console.log("Stranger timed out");
    return start();
  }
};
setInterval(waiter, 200);