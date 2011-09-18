var Omegle, om;
Omegle = require('omegle').Omegle;
om = new Omegle();
om.on('recaptchaRequired', function(key) {
  return console.log(key);
});
om.on('gotMessage', function(msg) {
  var repeat;
  console.log("Got message: " + msg);
  repeat = function() {
    return om.send("You said: " + msg, function(err) {
      return console.log("Message Sent (Error: " + err + ")");
    });
  };
  return setTimeout(repeat, 500);
});
om.on('strangerDisconnected', function() {
  console.log("Stranger disconnected");
  return setTimeout((function() {
    return om.start;
  }), 1000);
});
om.start(function() {
  return console.log("connected with id " + om.id);
});