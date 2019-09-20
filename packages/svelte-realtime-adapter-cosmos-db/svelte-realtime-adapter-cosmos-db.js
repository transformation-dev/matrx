/*
For MatrX use, we support temporal entities out of the box but if you would
rather not, that's fine, just make sure your objects do not have _isTemporal:true.
Your objects may come back with some extra stuff tacked on (like _entityID).

If that extra stuff gives you heartburn, you can do something about it.
All temporal functionality is in the adapter rather than the coordinator, which pretty
much just moves your objects around. So, it is possible to write your own adapter without
the temporal semantics.

If an object is missing an id field, one will be added. If it's missing an _entityID
a GUID will be added. If it's a non-temporal object (meaning it does not have _isTemporal:true) 
the _entityID will be set to the same value as the id field. When _isTemporal:true, any created
_entityID will be a new GUID.
*/

const cosmos = require('@azure/cosmos')
const fs = require('fs')
const path = require('path')

class Adapter {

  constructor() {
    console.log('Inside constructor of Adapter')
    this.upsertStoredProcedures()
  }

  upsertStoredProcedures() {
    const spFolder = path.join(__dirname, 'stored-procedures')
    const filenames = fs.readdirSync(spFolder)
    console.log(filenames)
    for (let filename of filenames) {
      const fullPath = path.join(spFolder, filename)
      console.log(fullPath)
      const body = require(fullPath)
      console.log(body.toString())
    }
  }

  // Query returning the most current version of entities
  async queryEntities(query) {

  }

  // Fetch the most current version of an entity
  async getEntity(entityID) {

  }

  /* 
  The operationsSpec is a list of entities to create, delete, or update.
  Later, we may support patch (or other incremental operations that are based upon the current value)
  
  This can be a mix of operations on temporal and non-temporal entities.

  For this adapter at least, we plan to use Azure Cosmos DB stored procedures will means the list
  of operations are the equivalent of a relational database transaction meaning all succeed or
  all fail.

  You must always provide the entire new object.

  For updates and deletes, you must also provide the entire old object including the id.
  If the old version id in the database does not match the id of the provided old object,
  or if the old id comes back and it's not the latest version (_validTo=Infinity) 
  the transaction will fail. This is how we implement optimistic concurrency.

  We want the entire old object so we can implement latency compensation. We'll keep the old
  version around while we simultaneously kick off realtime client updates and database operations.

  If the database operation fails because the old value was not the latest, the latest will be
  returned by the stored procedure and that will be broadcast. That may look like two glowing green
  around the value in rapid succession, but it should be rare enough not to be an annoyance.

  If the database operation fails for any other reason, we will send a revert event (with the 
  old version (which may have come back from the sproc)) for all operations in the operationSet 
  to all subscribed clients.
  
  We'll live with the slight risk of the app server rebooting before it can get a 
  database operation fail. When the clients reconnect to the rebooted app server the join operation 
  attempts to sync everything back up so it's hard for me to imagine a situation where
  the database and clients are out of sync for long... and it's a web app so a refresh fixes
  everything.
  
    [

      // Example create non-temporal. id and _entityID will be created and the same
      {operationType: 'create', new: {a: 1}},

      // Example create temporal. id and _entityID will be created and different
      {operationType: 'create', new: {_isTemporal: true, a: 1}},

      // Example update non-temporal. old must have both id and _entityID fields, 
      // id will be created for new object. Operation (and thus entire transaction) 
      // will fail if old.id does not match version in the database (optimistic concurrency)
      {operationType: 'update', old: {id: 1234, _entityID: 'B78', b: 10}, new: {_entityID: 'B78', b: 20, c: 30}}

      // Example delete temporal. Provide entire old version for latency compensation
      {operationType: 'delete', old: {id: 5678, _entityID: 'C42', ...}}
    ]
  */
  async operations(operationsSpec) {
    console.log('inside adapter.operations')
    // Call 'operations' stored procedure
    // What do we return if the call to the stored procedure fails?
  }

}

function getAdapter() {  // TODO: Allow authentication to be passed in to overide the default of getting it from environment variables
  if (! adapter) {
    adapater = new Adapter()
  }
  return adapater
}

let adapter

module.exports = {getAdapter}  // TODO: Eventually change this to export once supported