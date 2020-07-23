module.exports = async function (context, req) {
  const serverEnvironment = process.env.NODE_ENV
  let nodeEnv
  if (serverEnvironment === 'production') {
    nodeEnv = 'produciton'
  } else if (serverEnvironment === 'staging') {
    nodeEnv = 'staging'
  } else {
    nodeEnv = 'development'
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    headers: {
      'Content-Type': 'application/json'
    },
    // body: {nodeEnv: process.env.NODE_ENV, serverEnvironment}
    body: {nodeEnv, requestObject: context.req}
  }

  // const name = req.query.name || (req.body && req.body.name)
  // if (name) {
  //   context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: {name}
  //   }
  // } else {
  //   context.res = {
  //     status: 400,
  //     body: "Please pass a name on the query string for GET or in the request body as a POST"
  //   }
  // }
}
