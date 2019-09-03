# url-composer

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/RasCarlito/url-composer.svg?branch=master)](https://travis-ci.org/RasCarlito/url-composer)
[![bitHound Overall Score](https://www.bithound.io/github/RasCarlito/url-composer/badges/score.svg)](https://www.bithound.io/github/RasCarlito/url-composer)
[![npm](https://img.shields.io/npm/dm/url-composer.svg)](https://www.npmjs.com/package/url-composer)

Small lib for parsing and building dynamic URLs

# Install

You can install the lib via [npm](https://www.npmjs.com/)

```shell
npm install --save url-composer
```

or [bower](https://bower.io/)

```shell
bower install --save url-composer
```

# Usage

The library is very simple to use

```js
import url from 'url-composer'

url.build({
  host: 'https://github.com',
  path: '/:username',
  params: { username: 'RasCarlito' },
  query: { tab: 'repositories' },
  hash: 'your-repos-filter'
})
// "https://github.com/RasCarlito?tab=repositories#your-repos-filter"
```

Everything is optional. So calling `url.build()` without any parameters would just generate an empty `String`.

*Note: Path and query parameters are encoded using `encodeURIComponent`*

## Path options

The path option has an advanced syntax to handle injection of parameters.

### Named parameters

Like in the first example

```js
import url from 'url-composer'

url.build({
  path: '/users/:id',
  params: { id: 42 }
})
// "/users/42"
```

### Optional parameters

With optional parameters you can make a portion of the `path` optional using parentheses.
Depending on the `params` passed that portion will be included or left out.

```js
import url from 'url-composer'

const path = '/users/:id(/edit/:section)'

url.build({
  path,
  params: { id: 42 }
})
// "/users/42"

url.build({
  path,
  params: { id: 42, section: 'profile' }
})
// "/users/42/edit/profile"
```

## Testing a path

You can test a path to validate that it corresponds to a given schema

```js
import url from 'url-composer'

const path = '/users/:id(/edit/:section)'

// Testing path directly
url.test({ path, url: '/users/42' }) // true
url.test({ path, url: '/something/different' }) // false

// Getting the regex instead
const re = url.regex(path)

re.test('/users/42/edit/profile') // true
```

## Parsing a path

You can parse a path to extract the dynamic parts into an `Array` or an `Object`.

It will also extract the search query if it is present and place it as the last item in the resulting `Array` or in a `query` key in the resulting `Object`.

Missing optional parameters will result to `null` in the extracted values.

Lets look at some code to actually see how it works:

```js
import url from 'url-composer'

// Parsing dynamic parts into an Array
url.parse({
  path: '/users/42/edit/profile',
  definition: '/users/:id(/edit/:section)'
})
// ['42', 'profile', null]

// Parsing dynamic parts into an Object
url.parse({
  path: '/users/42/edit/profile',
  definition: '/users/:id(/edit/:section)',
  object: true
})
// { id: '42', section: 'profile', query: null }

// Parsing a path with a search query
url.parse({
  path: '/users/42/edit/profile?expand=true',
  definition: '/users/:id(/edit/:section)'
})
// ['42', 'profile', 'expand=true']

// Parsing dynamic parts into an Object
url.parse({
  path: '/users/42/edit/profile?expand=true',
  definition: '/users/:id(/edit/:section)',
  object: true
})
// { id: '42', section: 'profile', query: 'expand=true' }
```

# License

[MIT](https://opensource.org/licenses/MIT)
