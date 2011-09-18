Omegle = require('omegle').Omegle
irc = require 'irc'


class OmegleIrc

	constructor: (@host, @nick, @channel) ->
		@active = false
		
		@client = new irc.Client(@host, @nick)
		@client.on 'message', (from, to, message) =>
			console.log "From #{from} to #{to} => #{message}"
			if message[0] is '>'
				@command message[1..]
		
		@client.on 'error', (err) ->
			console.log "Error:"
			console.log err
		
		@client.join @channel, ->
			@command '!help'
		
		@omegle = new Omegle()
		
		@omegle.on 'recaptchaRequired', (id) =>
			@say "Please solve recaptcha with id: #{id} on the host machine!"
		
		@omegle.on 'gotMessage', (msg) =>
			console.log "Message #{msg}"		
			@say msg
		
		@omegle.on 'typing', =>
			console.log "Typing"
			
		@omegle.on 'strangerDisconnected', =>
			@say 'Stranger Disconnected'
			@command '!next'
		
	command: (msg) ->
	
		console.log "command: #{msg}, active: #{@active}"
	
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
					@omegle.disconnect =>
						@active = false
						@say 'Stopped'
					
			when '!next'
				@say 'Target disconnected'
				@omegle.disconnect -> start()
			
			when '!help'
				@say 'Avaliable commands: >!about, >!start, >!stop, >!next, >[msg]'	
				
			when '!about'
				@say 'I am an Omegle IRC bot. To start a conversation type  >!start'
				@say 'To say something type  >[msg]  where [msg] is the message'
				@say 'I was created by Callum Rogers in 2011'
				
			else
				if @active
					@omegle.send msg, (err) -> console.log "Send error: #{err}"
	
	say: (msg) ->
		@client.say @channel, msg
				

oirc = new OmegleIrc '<host>', '<nick>', '<channel>'
