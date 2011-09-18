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
    this.client = new irc.Client(this.host, this.nick, [this.channel]);
    this.client.on('message', __bind(function(from, to, message) {
      console.log("From " + from + " to " + to + " => " + message);
      if (message[0] === '>') {
        return this.command(message.slice(1));
      }
    }, this));
    this.client.join(this.channel);
    this.omegle = new Omegle();
  }
  OmegleIrc.prototype.command = function(msg) {
    var start;
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
          return omegle.disconnect(function() {
            return this.active = false;
          });
        }
        break;
      case '!next':
        this.say('Target disconnected');
        return omegle.disconnect(function() {
          return start();
        });
      case '!help':
        return this.say('Avaliable commands: >!start, >!stop, >!next, >[msg]');
      default:
        if (this.active) {
          return omegle.send(msg);
        }
    }
  };
  OmegleIrc.prototype.say = function(msg) {
    return this.client.say(this.channel, msg);
  };
  return OmegleIrc;
})();
oirc = new OmegleIrc('irc.freenode.net', 'Strangerest', ['##calpol']);