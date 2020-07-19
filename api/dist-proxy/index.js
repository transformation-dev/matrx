const fs = require("fs")
const path = require('path')
const mime = require('mime-types')

module.exports = function (context, req) {

  let file = "index.html"

  if (req.query.file) {
    file = req.query.file
  }

  const fullPath = path.join(__dirname, '..', '..', 'dist', file)

  fs.readFile(fullPath, (err, data) => {

    context.log('GET ' + "/" + file)

    if (!err) {

      const contentType = mime.lookup(file)

      context.res = {
        status: 200,
        body: data,
        isRaw: true,
        headers: {
          'Content-Type': contentType
        }
      }
    } else {

      context.log("Error: " + err)

      context.res = {
        status: 404,
        body: "Not Found.",
        headers: {
        }
      }
    }
    context.done()
  })
}
