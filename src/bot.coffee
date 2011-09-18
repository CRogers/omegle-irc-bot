Omegle = require('omegle').Omegle

om = new Omegle()

om.on 'recaptchaRequired', (key) ->
	console.log key
	
om.on 'gotMessage', (msg) ->
	console.log "Got message: #{msg}"
	
	repeat = -> 
		om.send "You said: #{msg}", (err) ->
			console.log "Message Sent (Error: #{err})"
	
	setTimeout repeat, 500

om.on 'strangerDisconnected', ->
	console.log "Stranger disconnected"
	start()

om.on 'typing', -> console.log 'Stranger started typing'
om.on 'stoppedTyping', -> console.log 'Stranger stopped typing'

start = ->
	om.start -> 
		console.log "connected with id #{om.id}"
		

start()
