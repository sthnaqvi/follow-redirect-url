# follow-redirect-url

[![NPM](https://nodei.co/npm/follow-redirect-url.png)](https://nodei.co/npm/follow-redirect-url/)

[![Node version](https://img.shields.io/node/v/follow-redirect-url.svg?style=flat)](http://nodejs.org/download/)
[![npm version](https://badge.fury.io/js/follow-redirect-url.png)](https://badge.fury.io/js/follow-redirect-url)
[![Build Status](https://img.shields.io/travis/sthnaqvi/follow-redirect-url.svg?style=flat-square)](https://travis-ci.org/sthnaqvi/follow-redirect-url)
[![Coverage](https://img.shields.io/codecov/c/github/sthnaqvi/follow-redirect-url.svg?style=flat-square)](https://codecov.io/github/sthnaqvi/follow-redirect-url)
[![Dependency Status](https://img.shields.io/david/sthnaqvi/follow-redirect-url.svg?style=flat-square)](https://david-dm.org/sthnaqvi/follow-redirect-url)
[![Known npm Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/follow-redirect-url.svg?label=npm%20vulnerabilities&style=flat-square)](https://snyk.io/test/npm/follow-redirect-url)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/sthnaqvi/follow-redirect-url.svg?label=repo%20vulnerabilities&style=flat-square&targetFile=package.json)](https://snyk.io/test/github/sthnaqvi/follow-redirect-url?targetFile=package.json)
![Downloads Total](https://img.shields.io/npm/dt/follow-redirect-url.svg)
![Downloads Monthly](https://img.shields.io/npm/dm/follow-redirect-url.svg)


A simple command-line utility that lets you follow redirects to see where http URLs end up. Useful for shortened URLs.

Follows up to 20 redirects Default.

Also added User-Agent header to requests, some web address won't redirect without browsers information eg: https://fb.me


## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Output](#output)
- [Options](#options)


## Installation

### Install with npm globally (For CLI):
```
npm install -g follow-redirect-url
```

### Install for your project:
```
npm install -save follow-redirect-url
```
[back to top](#table-of-contents)


---
## Usage

### CLI:

```
follow https://bit.ly/2X7gCIT
```

### Module:
The first argument is a `url` string.
``` js
'use strict';

const followRedirect = require('follow-redirect-url');

followRedirect.startFollowing('https://bit.ly/2X7gCIT').then(urls => {
    console.log(urls);
}).catch(error => {
    console.log(error)
})
```
[back to top](#table-of-contents)


---

## Output

### CLI Result:
```
https://bit.ly/2X7gCIT -> 301
http://github.com/sthnaqvi/follow-redirect-url -> 301
https://github.com/sthnaqvi/follow-redirect-url -> 200
```

### Project Result:
```
[ { url: 'https://bit.ly/2X7gCIT',
    redirect: true,
    status: 301,
    redirectUrl: 'http://github.com/sthnaqvi/follow-redirect-url' },
  { url: 'http://github.com/sthnaqvi/follow-redirect-url',
    redirect: true,
    status: 301,
    redirectUrl: 'https://github.com/sthnaqvi/follow-redirect-url' },
  { url: 'https://github.com/sthnaqvi/follow-redirect-url',
    redirect: false,
    status: 200 } ]
```
[back to top](#table-of-contents)


---
## Options

### CLI options:

#### Under development

### Module options:
The second argument is an `options` object. Options are optional.

- `max_redirect_length` - maximum redirection limit. Default: `20`
- `request_timeout` - request timeout in milliseconds. Default: `10000`
- `ignoreSslErrors` - ignore SSL certificate errors when following redirects. Default: `false`
-
``` js
const followRedirect = require('follow-redirect-url');

const options = {
    max_redirect_length: 5,
    request_timeout: 5000,
    ignoreSsslErrors: true
};

followRedirect.startFollowing('https://bit.ly/2X7gCIT', options).then(urls => {
    console.log(urls);
}).catch(error => {
    console.log(error)
})
```

[back to top](#table-of-contents)
