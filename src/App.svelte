<script>
  import Router from 'svelte-spa-router'
  import {link, push, location, querystring} from 'svelte-spa-router'  // TODO: remove the ones I don't use
  import active from 'svelte-spa-router/active'
  import {derived} from 'svelte/store'
  import {getClient} from '@matrx/svelte-realtime-store'

  import routes from './routes'

  function isActive(node, path) {
    return active(node, path, 'is-active')  // TODO: Change to 'is-active' when for Bulma
  }

  const realtimeClient = getClient()

  const origin = derived([location, querystring], ([$location, $querystring]) => {
    return $location + ($querystring ? '?' + $querystring : '')
  })
  
  const allowUnathenticated = new Set([  // TODO: Upgrade this to allow for route expressions using https://www.npmjs.com/package/regexparam
    '/login',
    '/wild/something'
  ])

  origin.subscribe((value) => {
    if (!allowUnathenticated.has($location)) {
      realtimeClient.restoreSession((err) => {
        if (err) {
          push('/login?origin=' + value)    
        } else {
          if ($location == '/login') {
            push(value)
          }
        }
      })
    }
  })
</script>


<nav class="navbar ">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <img src="MatrXCloseWhite.png" alt="MatrX Logo">
      </a>
      <div class="navbar-burger burger" data-target="navMenuExample1">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div id="navMenuExample1" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item" href="#">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="/#/morgan">
            Morgan
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item " href="#">
              Overview
            </a>
            <a class="navbar-item " href="#">
              Modifiers
            </a>
            <a class="navbar-item " href="#">
              Grid
            </a>
            <a class="navbar-item " href="#">
              Form
            </a>
            <a class="navbar-item " href="#">
              Elements
            </a>
            <a class="navbar-item is-active" href="#">
              Components
            </a>
            <a class="navbar-item " href="#">
              Layout
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item">
              <div>version
                <p class="has-text-info is-size-6-desktop">0.4.3</p>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="#blog/">
            Blog
          </a>
          <div id="blogDropdown" class="navbar-dropdown " data-style="width: 18rem;">
            <a class="navbar-item" href="/2017/03/10/new-field-element/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">10 Mar 2017</small>
                </p>
                <p>New field element (for better controls)</p>
              </div>
            </a>
            <a class="navbar-item" href="/2016/04/11/metro-ui-css-grid-with-bulma-tiles/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">11 Apr 2016</small>
                </p>
                <p>Metro UI CSS grid with Bulma tiles</p>
              </div>
            </a>
            <a class="navbar-item" href="/2016/02/09/blog-launched-new-responsive-columns-new-helpers/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-info">09 Feb 2016</small>
                </p>
                <p>Blog launched, new responsive columns, new helpers</p>
              </div>
            </a>
            <a class="navbar-item" href="#blog/">
              More posts
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item">
              <div class="navbar-content">
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <strong>Stay up to date!</strong>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <a class="button is-rss is-small" href="#atom.xml">
                        <span class="icon is-small">
                          <i class="fa fa-rss"></i>
                        </span>
                        <span>Subscribe</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">
            More
          </div>
          <div id="moreDropdown" class="navbar-dropdown ">
            <a class="navbar-item " href="#extensions/">
              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <p>
                      <strong>Extensions</strong>
                      <br>
                      <small>Side projects to enhance Bulma</small>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <a class="navbar-item" href="https://github.com/jgthms/bulma" target="_blank">
          Github
        </a>
        <a class="navbar-item" href="https://twitter.com/jgthms" target="_blank">
          Twitter
        </a>
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <a id="twitter" class="button">
                <span>Tweet</span>
              </a>
            </p>
            <p class="control">
              <a class="button is-primary" href="https://github.com/jgthms/bulma/archive/0.4.3.zip">
                <span class="icon">
                  <i class="fa fa-download"></i>
                </span>
                <span>Download</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>

<Router {routes}/>
