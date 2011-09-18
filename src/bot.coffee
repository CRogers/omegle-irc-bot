Omegle = require('omegle').Omegle

time = -> new Date().getTime()
lastSaid = time()

om = new Omegle()

om.on 'recaptchaRequired', (key) ->
	console.log "Recaptcha Required: #{key}"
	
om.on 'gotMessage', (msg) ->
	lastSaid = time()
	console.log "Got message: #{msg}"
	
	repeat = ->
		sent = "You said: #{msg}" 
		om.send sent, (err) ->
			console.log if !err then "Message sent: #{sent}" else "Error: #{err}"
	
	om.startTyping
	setTimeout repeat, 800

om.on 'strangerDisconnected', ->
	console.log "Stranger disconnected"
	start()

om.on 'typing', -> console.log 'Stranger started typing'
om.on 'stoppedTyping', -> console.log 'Stranger stopped typing'

start = ->
	om.disconnect -> console.log "disconnected\n"
	om.start -> 
		console.log "connected with id #{om.id}"
		lastSaid = time()
		

start()

waiter = ->
	if time() - lastSaid > 20 * 1000
		console.log "Stranger timed out"
		start()
		

setInterval waiter, 200
