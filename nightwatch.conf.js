// Increase max listeners to avoid a warning
require('events').EventEmitter.defaultMaxListeners = 100

module.exports = {
    src_folders: [
        'test/'
    ],

    output_folder: 'result',

    webdriver: {
        start_process: true,
        // server_path: 'node_modules/.bin/chromedriver',
        server_path: 'node_modules/.bin/geckodriver',
        // port: 9515
        port: 4444
    },

    test_runner: {
        type: 'mocha',
        options: {
            ui: 'bdd',
            reporter: 'list'
        }
    },

    test_settings: {
        default: {
            desiredCapabilities: {
              "browserName": "firefox",
              "javascriptEnabled": true,
              "marionette": true,
              "acceptSslCerts": true,
              "moz:firefoxOptions": {
                "binary": "/usr/bin/firefox-esr",
                // "args": ["-P"]
              }
                // browserName: 'chrome',
                // chromeOptions: {
                //     binary: "node_modules/chromium/lib/chromium/chrome-linux/chrome",
                //     args: [
                //         // '--headless',
                //         '--no-sandbox',
                //         '--disable-gpu'
                //     ]
                // }
            }
        }
    }
}
