const { includes } = require("lodash")

module.exports = async function (context, req) {
  const assigneeID = process.env.WEBSITE_STATICWEBAPP_FUNCTION_ASSIGNEEID
  let environment
  if (assigneeID) {
    if (assigneeID.includes('app/master')) {
      environment = 'production'
    } else {
      environment = 'staging'
    }
  } else {
    environment = 'development'
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    headers: {
      'Content-Type': 'application/json'
    },
    // body: {nodeEnv: process.env.NODE_ENV, serverEnvironment}
    body: {environment, requestObject: context.req}
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
