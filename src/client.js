import * as sapper from '@sapper/app'

import 'bootstrap/dist/css/bootstrap.min.css'
// import 'popper.js'  // Popovers seem to work fine without this import. Maybe it's imported automatically with bootstrap
import $ from 'jquery'
import 'bootstrap'

$(function () {
  $('[data-toggle="popover"]').popover()
})

sapper.start({
	target: document.querySelector('#sapper')
})