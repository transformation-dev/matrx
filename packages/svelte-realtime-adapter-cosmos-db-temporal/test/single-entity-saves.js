
const { CosmosClient } = require("@azure/cosmos")
const https = require("https")
const test = require('tape')
const {isMatch} = require('lodash')

async function runTests() {
  const client = new CosmosClient({
    endpoint: `https://localhost:8081`,
    key: "dummy key",
    // disable SSL verification
    // since the server uses self-signed certificate
    agent: https.Agent({ rejectUnauthorized: false })
  })

  // initialize databases since the server is always empty when it boots
  const {database} = await client.databases.createIfNotExists({ id: 'test-db' });
  const {container} = await database.containers.createIfNotExists({ id: 'test-container' });

  test('Single Entity Saves', async function (t) {
    const o = await container.items.upsert({b:2})
    // console.log(o)
    const {resource} = o
    t.assert(isMatch(resource, {b:2}))
    t.end()
  })

  test('1 = 1', async function (t) {
    t.equal(1, 1)
    t.end()
  })
}

runTests()
