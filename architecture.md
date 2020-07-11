## Azure static website. Awesome sauce!!!
Static website via: https://docs.microsoft.com/en-us/azure/static-web-apps/apis

### To test
#### For automated testing
  * Use the guide in ttps://docs.microsoft.com/en-us/azure/static-web-apps/apis which is GitHub Actions 
    based and creates a new environment per pull request. NICE!!! but not sure how well it supports CosmosDB
  * Use production Pusher or SignalR instance just make sure that _entityIDs are GUIDs and no data is ever moved from one 
    to the other without changing the _entityID
#### For local testing
  * Azure Functions Core Tools via `npm` and Visual Studio Code support for Azure Functions
  * Zeit CosmosDB emulator or ephemerally esablished resource on actual CosmosDB (product resource is static)
  * Use production Pusher or SignalR

### Needed Azure Functions
  * (probably not needed) /pusher/auth - I think we can avoid the extra round trip associated with this.
    "auth" here stands for "authorize" so it means access control. However, Pusher offers an option to 
    pre-authorize. When we retrun from the call to /subscribe, we'll already know if they are authorized.
    So, we need to keep an authorized flag in the store. Default it to false. Reset it to false at the beggining of 
    a call to /subscribe and set it to true if the call to /subscribe succeeds.
  * /login - exists now but need to make actually work
  * /checkauth - exists now but also need to make actually work
  * /update
    * (maybe later) A wrapper around the CosmosDB Sproc of the same name
    * (maybe later) Takes an array of updates
    * Immediately pushes updated entity value(s) to subscribers except the sender (latency compensation)
      (see: https://pusher.com/docs/channels/server_api/excluding-event-recipients)
    * Callers must include the old values of all the effected entities
    * If the CosmosDB call times out, these old values are pushed to all subscribers including the sender
    * If the CosmosDB returns with an error
      * That error reply may include the most recently saved values. These are pushed to all subscribers including the sender
      * If not, then the old values from the initial call are pushed to all subscribers including the sender
    * The overall response includes whatever the settled values in the body even if the update is not code 200
    * (later) It also checks to see if any saved aggregations that have subscribers (how will we tell?) are effected by
      these settled values and triggers updates of those by fire-and-forget calls to /aggregation (UPDATE)
  * /subscribe - returns the latest version or errors if unauthorized
  * /latest - an alias for /subscribe. Ignore the subscription token if you want
  * /query - Has full query capability including _validFrom, _validTo, and _previousValues
  * (later) /aggregation (GET, POST, UPDATE) - Uses Lumenize to implement materialized views. 
    * POST creates a new aggregation
    * GET fetches the saved state
    * UPDATE triggers an update
    * We'll wrap PusherStore to make AggregationStore
    * The metadata for the aggregation (e.g. lastUpdated) is saved under an _entityID which is 'aggregation-' + an MD5 hash 
      of the aggregation spec
    * The wrapped PusherStore subscribes to this _entityID. When it's updated, AggregationStore
      will round trip fetch the saved state of the aggregation
    

## Pusher flow
### Links
* https://pusher.com/docs/channels

### Concepts
* Channels
  * Use encrypted channels
  * Channels are named {"private-encrypted-" + _entityID}
  * Each component will subscribe to a channel but we can globally bind to an 'update' event on any channel the connection 
    is currently subscribed to with: https://pusher.com/docs/channels/using_channels/events#binding-on-the-client. 
    If the event callbacks from those subscriptions get passed the channel name, we can update the correct stores.
* All changes occur via REST APIs, so there is no need to have any server subscribe to anything. When updates come in,
  they are immediately Pushed to the channel named _entityID and reverted if the database save fails.
  Later, we may also have an Azure Function that's listening for CosmosDB changes and will automatically publish an 
  update to the Pusher channel named _entityID. That would allow updates to come from Sprocs or sources other than
  POSTing to /update. For now, all is coming in through /update so no need for this yet.
* Only create _entityID stores inside components so onDestroy will always unsubscribe. We may still end up with some
  leaks in rare cases, but I'm hoping Pusher eventually cleans those up.

### PusherStore (svelte-pusher-store) in place of svelte-realtime-store
  * Methods:
    * constructor
      * returns early if an instance is in PusherStore.storeCache, otherwise...
      * to be able to use it as a callback `this.onDestroy = this.onDestroy.bind(this)`
      * If storeConfig.isGlobal is false, use svelte's onDestroy feature so it will be destroyed when the
        referencing component is destroyed
      * sticks the config in PusherStore.configCache
      * sticks this in PusherStore.storeCache
      * fire and forget call to this.subscribe()
    * onDestroy() - calls this.logout() and removes the store from PusherStore.storeCache
    * async login()
      * this.authorized = false
      * hits /subscribe. If that succeeds...
        * this.authorized = true
        * subscribes to Pusher channel
      * else this.authorized = false
      * returns this.authorized
    * logout() - unsubscribes from Pusher and sets this.authorized to false
    * set(newValue)
      * this.oldValue = this.newValue
      * this.newValue = newValue
      * calls wrappedStore.set(newValue)
      * POST to /update with newValue
      * If it fails or timesout, make a call to wrappedStore.set(oldValue)
  * PusherStore has some static Class properties and methods that allow it to serve as a caching factory
    * storeCache - Whenever a store is created, it's stuck in here. Use a Map with the key of storeID.
    * configCache - Whenever a store is created its storeConfig is cached here. Map with key of storeID.
    * get(storeID) - if you know that an instance has been previously created (like for stores created in stores.js)
      then you can use this. Even if the cached store itself was destroyed by a logout, the configCache should have
      it and be able to create a new instance
    * (not needed any more) destroy(storeID) - if in the storeCache calls the onDestroy method which removes it from the storeCache,
      but leaves it in the configCache
    * (not needed any more) destroyAll() - Calls destroy() for everything in the storeCache. 
    * logoutAll() - Calls logout() for everything in the storeCache
    * loginAll() - Calls login() for everything in the storeCache
    * customPusherAuthorizer(callback) 
      * see: https://support.pusher.com/hc/en-us/articles/360019419713-Providing-a-custom-Channels-authoriser
      * If it's in the storeCache...
        * store.authorized is true, `callback(false, authData)`. Otherwise...
        * If store.authorized is false, `authorized = await store.login()`
        * if authorized = true, `callback(false, authData)`. Otherwise...
        * `callback(true, "You are not authorized to access this entity")`
      * `callback(true, "A store with this storeID has not been instantiated")`

### On reload
* Must NOT forceably disconnect. If the user is still logged in after the reload as defined by the cookie, then, it reads
  as though Pusher connection will reconnect. When the components instantiate, they will re-subscribe but I also don't think
  that's a problem. Will have to confirm that we don't get multiple messages for the same store for the same update.

### On logout
* logout will call PusherStore.logoutAll() which will unsubscribe and destroy
* login will call PusherStore.loginAll()

#### Original thinking for logout superceded by above
* I don't think we want to forceably disconnect but I also don't think that old subscriptions will be valid after
  the user logs back in because they will have a new token. If so, I'm not sure what we need to do 
  with the orphaned subscriptions. Will they eventually time out?
* However, stores created in stores.js will not be destroyed AND I believe that the old subscription is invalid because
  the user has a new token. Maybe we add a storeConfig option to not auto-subscribe and we provide a subscribe() method
  as well as a subscribeAll() function in stores.js. We call subscribeAll() when stores.js is first loaded and we
  call it every time we login.


## SignalR flow [OUTDATED]
### Links
* https://www.npmjs.com/package/@microsoft/signalr

### Concepts
* SignalR users can have multiple connections. If a message is sent to a specific user it goes to them on every connection.
  Ignore all that though, because Groups are joined per connection which matches our use case better... although I'm still a
  bit fuzzy on all this. I don't see how to pass the connection id to the output binding of an Azure Function.

### On subscribe
* POST to Azure Function
* Will read the _entityID from Cosmos DB and confirm access is allowed
* There doesn't appear to be a way for the javascript client itself to join a group so, this Azure Function will also add this user to the group named _entityID. See: https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?tabs=javascript#add-user-to-a-group-2
* PROBLEM with the above. See my question on StackOverflow: https://stackoverflow.com/questions/62708652/how-to-create-azure-functions-output-binding-for-signalr-to-add-a-connection
* If all of the above is successful the reply includes the latest value
* Note: Since all changes occur via REST APIs, there is no need to have any server subscribe to anything.
  The Azure Function below that's listening for CosmosDB changes will automatically publish an update to the SignalR
  group named _entityID

### On destroy of a component
* Must remove user from SignalR group https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?tabs=javascript#remove-user-from-a-group-2

### On logout
* Must remove a user from all groups. How?

### On update
* Update/Set in local svelte-realtime-store instantly
* POST to /update
* The above POST will reply
  * If it fails or timesout, the store value is reverted
* A different function monitors changes and sends to SignalR so everyone monitoring the same "group" (group name is _entityID) are updated, including the original sender, unfortunately https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?tabs=javascript#send-to-a-group
