var Omegle, OmegleIrc, irc, oirc;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Omegle = require('omegle').Omegle;
irc = require('irc');
OmegleIrc = (function() {
  function OmegleIrc(host, nick, channel) {
    this.host = host;
    this.nick = nick;
    this.channel = channel;
    this.active = false;
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
    this.client.join(this.channel, function() {
      return this.command('!help');
    });
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
      this.say('Stranger Disconnected');
      return this.command('!next');
    }, this));
  }
  OmegleIrc.prototype.command = function(msg) {
    var start;
    console.log("command: " + msg + ", active: " + this.active);
    start = __bind(function() {
      return this.omegle.start(__bind(function() {
        this.active = true;
        return this.say("Target Aquired (id: " + this.omegle.id + ")");
      }, this));
    }, this);
    switch (msg) {
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
        return this.say('Avaliable commands: >!about, >!start, >!stop, >!next, >[msg]');
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
    return this.client.say(this.channel, msg);
  };
  return OmegleIrc;
})();
oirc = new OmegleIrc('<host>', '<nick>', '<channel>');