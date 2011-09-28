var Omegle, OmegleIrc, c, colors, inArray, irc, oirc, styles;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Omegle = require('omegle').Omegle;
irc = require('irc');
c = require('irc-colors');
colors = ['teal', 'bluecyan', 'cyan', 'aqua', 'blue', 'royal', 'pink', 'lightpurple', 'fuchsia', 'gray', 'grey', 'lightgray', 'lightgrey', 'silver', 'white', 'black', 'navy', 'green', 'red', 'brown', 'rainbow'];
styles = ['normal', 'bold', 'underline', 'italic'];
inArray = function(arr, a) {
  var item, _i, _len;
  for (_i = 0, _len = arr.length; _i < _len; _i++) {
    item = arr[_i];
    if (item === a) {
      return true;
    }
  }
  return false;
};
OmegleIrc = (function() {
  function OmegleIrc(host, nick, channel) {
    this.host = host;
    this.nick = nick;
    this.channel = channel;
    this.active = false;
    this.color = 'teal';
    this.style = 'bold';
    this.client = new irc.Client(this.host, this.nick);
    this.client.on('message', __bind(function(from, to, message) {
      console.log("From " + from + " to " + to + " => " + message);
      if (message[0] === '>') {
        return this.command(message.slice(1));
      }
    }, this));
    this.client.on('error', function(err) {
      console.log("Error:");
      return console.log(err);
    });
    this.client.join(this.channel, __bind(function() {
      return this.command('!help');
    }, this));
    this.omegle = new Omegle();
    this.omegle.on('recaptchaRequired', __bind(function(id) {
      return this.say("Please solve recaptcha with id: " + id + " on the host machine!");
    }, this));
    this.omegle.on('gotMessage', __bind(function(msg) {
      console.log("Message " + msg);
      return this.say(msg);
    }, this));
    this.omegle.on('typing', __bind(function() {
      return console.log("Typing");
    }, this));
    this.omegle.on('strangerDisconnected', __bind(function() {
      return this.command('!next');
    }, this));
  }
  OmegleIrc.prototype.command = function(msg) {
    var arg, command, start;
    console.log("command: " + msg + ", active: " + this.active);
    start = __bind(function() {
      return this.omegle.start(__bind(function() {
        this.active = true;
        return this.say("Target Aquired (id: " + this.omegle.id + ")");
      }, this));
    }, this);
    command = msg.match(/\S+/)[0];
    switch (command) {
      case '!start':
        if (this.active) {
          return this.say('<Already Started!>');
        } else {
          return start();
        }
        break;
      case '!stop':
        if (!this.active) {
          return this.say('<Not Started!>');
        } else {
          return this.omegle.disconnect(__bind(function() {
            this.active = false;
            return this.say('Stopped');
          }, this));
        }
        break;
      case '!next':
        this.say('Target disconnected');
        return this.omegle.disconnect(function() {
          return start();
        });
      case '!help':
        if (msg === command) {
          this.say('Avaliable commands: >!help, >!about, >!start, >!stop, >!next, >[msg], >!color, >!style');
        }
        switch (msg.slice(6)) {
          case 'color':
            return this.say("Avaliable colours: " + colors);
          case 'style':
            return this.say("Avaliable styles: " + styles);
        }
        break;
      case '!color':
        arg = msg.slice(7);
        if (inArray(colors, arg)) {
          this.color = arg;
          return this.say("<Color is now " + arg + ">");
        } else {
          return this.say("<" + arg + " is not a color!>");
        }
        break;
      case '!style':
        arg = msg.slice(7);
        if (inArray(styles, arg)) {
          this.style = arg;
          return this.say("<Style is now " + arg + ">");
        } else {
          return this.say("<" + arg + " is not a style!>");
        }
        break;
      case '!about':
        this.say('I am an Omegle IRC bot. To start a conversation type  >!start');
        this.say('To say something type  >[msg]  where [msg] is the message');
        return this.say('I was created by Callum Rogers in 2011');
      default:
        if (this.active) {
          return this.omegle.send(msg, function(err) {
            return console.log("Send error: " + err);
          });
        }
    }
  };
  OmegleIrc.prototype.say = function(msg) {
    return this.client.say(this.channel, this.style === 'normal' ? c[this.color](msg) : c[this.style][this.color](msg));
  };
  return OmegleIrc;
})();
oirc = new OmegleIrc(process.argv[2], process.argv[3], process.argv[4]);