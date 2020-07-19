module.exports = async function (context, req) {
  const name = req.query.name || (req.body && req.body.name)
  if (name) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      headers: {
        'Content-Type': 'application/json'
      },
      body: {name}
    }
  } else {
    context.res = {
      status: 400,
      body: "Please pass a name on the query string for GET or in the request body as a POST"
    }
  }
}
