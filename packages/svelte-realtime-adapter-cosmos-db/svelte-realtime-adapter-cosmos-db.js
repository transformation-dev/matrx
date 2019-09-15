class Adapter {

  constructor() {
    console.log('Inside constructor of Adapter')
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