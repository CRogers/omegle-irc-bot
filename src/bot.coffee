Omegle = require('omegle').Omegle
irc = require 'irc'
c = require 'irc-colors'

colors = ['teal', 'bluecyan', 'cyan', 'aqua', 'blue', 'royal', 'pink', 'lightpurple', 'fuchsia', 'gray', 'grey', 'lightgray', 'lightgrey', 'silver', 'white', 'black', 'navy', 'green', 'red', 'brown', 'rainbow']

styles = ['normal', 'bold', 'underline', 'italic']

inArray = (arr, a) ->
	for item in arr
		if item is a
			return true
	
	return false

class OmegleIrc

	constructor: (@host, @nick, @channel) ->
		@active = false
		@color = 'teal'
		@style = 'bold'
		
		@client = new irc.Client(@host, @nick)
		@client.on 'message', (from, to, message) =>
			console.log "From #{from} to #{to} => #{message}"
			if to is @channel
				if message[0] is '>'
					@command message[1..]
		
		@client.on 'error', (err) ->
			console.log "Error:"
			console.log err
		
		@client.join @channel, =>
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
			@command '!next'
		
	command: (msg) ->
	
		console.log "command: #{msg}, active: #{@active}"
	
		start = =>
			@omegle.start =>
				@active = true
				@say "Target Acquired (id: #{@omegle.id})"
	
		command = msg.match(/\S+/)[0]
		
		switch command
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
				if msg is command
					@say 'Available commands: >!help, >!about, >!start, >!stop, >!next, >[msg], >!color, >!style'
				
				switch msg[6..]
					when 'color', '!color', '>!color'
						@say "Available colours: #{colors}"
					
					when 'style', '!style', '>!style'
						@say "Available styles: #{styles}"
			
			when '!color'
				arg = msg[7..]
				if inArray colors, arg
					@color = arg
					@say "<Color is now #{arg}>"
				else
					@say "<#{arg} is not a color!>"
			
			when '!style'
				arg = msg[7..]
				if inArray styles, arg
					@style = arg
					@say "<Style is now #{arg}>"
				else
					@say "<#{arg} is not a style!>"
				
			when '!about'
				@say 'I am an Omegle IRC bot. To start a conversation type  >!start'
				@say 'To say something type  >[msg]  where [msg] is the message'
				@say 'I was created by Callum Rogers in 2011'
				
			else
				if @active
					@omegle.send msg, (err) -> console.log "Send error: #{err}"
	
	say: (msg) ->
		@client.say @channel, if @style is 'normal' then c[@color](msg) else c[@style][@color](msg)

oirc = new OmegleIrc process.argv[2], process.argv[3], process.argv[4]
