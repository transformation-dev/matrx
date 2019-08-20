import * as sapper from '@sapper/app'

import Faye from 'faye'
window.pubsubClient = new Faye.Client('pubsub')  // TODO: Find a better way than attaching to window

sapper.start({
	target: document.querySelector('#sapper')
})