import * as sapper from '@sapper/app'

// const pubsubClient = new Faye.Client('pubsub')

// pubsubClient.subscribe('/messages', function(message) {
// 	console.log('Got a message: ' + message.text);
// })

// pubsubClient.publish('/messages', {
// 	text: 'Hello world'
// })

sapper.start({
	target: document.querySelector('#sapper')
})