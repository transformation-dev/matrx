// TODO: Consider deleting this file unless we figure out how to globally specify the login goto 

import {getClient} from '@matrx/svelte-realtime-store'
const realtimeClient = getClient()

export {realtimeClient}