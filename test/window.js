/*eslint-env mocha */

const assert = require('assert')

describe('window', function() {
    // Increase timeouts
    this.slow(2000)
    this.timeout(3000)

    it('title', (browser) => {
        browser
          .url('http://localhost:8080/#/')
          .getTitle((title) => {
            console.log(title)
            assert.ok(title.includes("MatrX"))

          })
    })
})
