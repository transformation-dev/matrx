import * as sapper from '@sapper/app'

const pubsubClient = new Faye.Client('pubsub')
  
sapper.start({
	target: document.querySelector('#sapper')
})