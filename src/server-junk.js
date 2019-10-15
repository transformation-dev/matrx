const sirv = require('sirv');
const polka = require('polka');
const compress = require('compression')();
 
// Init `sirv` handler
const assets = sirv('dist', {
  maxAge: 31536000, // 1Y
  immutable: true
});
 
polka()
  .use(compress, assets)
  .listen(8080)
  // .then(() => {
  //   console.log('> Ready on localhost:3000~!');
  // });