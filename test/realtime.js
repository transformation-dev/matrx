/*eslint-env mocha */

const assert = require('assert')

describe('realtime', function() {
  // Increase timeouts
  this.slow(2000)
  this.timeout(3000)

  it('store sync', (browser) => {
    let handle1, handle2
    browser
      .url('http://localhost:8080/#/login?origin=/poc')
      .waitForElementVisible('button[id=login]')
      .click('button[id=login]')

    browser
      .waitForElementVisible('#a')
      .click('#new-window', (result) => {
        console.log('click', result)
        browser
          .windowHandles((result) => {
            console.log('windowHandles', result)
          })
      })



    // Open new tab and set handle2
    // browser
    //   .openNewWindow((result) => {
    //     console.log(result)
    //   })

    // // do something
    // browser
    //   .closeWindow(); // Close tab

    // // Switch to main window
    // browser
    //   .windowHandles((result) => {
    //   // 0 == current main window, 1 == new tab
    //   var handle = result.value[0]
    //   browser.switchWindow(handle)
    // })
  })
})
