Omegle = require('omegle').Omegle
irc = require 'irc'


class OmegleIrc

	constructor: (@host, @nick, @channel) ->
		@active = false
		
		@client = new irc.Client(@host, @nick, [@channel])
		@client.on 'message', (from, to, message) =>
			console.log "From #{from} to #{to} => #{message}"
			if message[0] is '>'
				@command message[1..]
		
		@client.join @channel
		
		@omegle = new Omegle()
		
		
	command: (msg) ->
	
		start = =>
			@omegle.start =>
				@active = true
				@say "Target Aquired (id: #{@omegle.id})"
	
		switch msg
			when '!start'
				if @active
					@say '<Already Started!>'
				else
					start()
					
			when '!stop'
				if !@active
					@say '<Not Started!>'
				else
					omegle.disconnect -> @active = false
					
			when '!next'
				@say 'Target disconnected'
				omegle.disconnect -> start()
			
			when '!help'
				@say 'Avaliable commands: >!start, >!stop, >!next, >[msg]'	
			else
				omegle.send msg if @active
	
	say: (msg) ->
		@client.say @channel, msg
				

oirc = new OmegleIrc 'irc.freenode.net', 'Strangerest', ['##calpol']
