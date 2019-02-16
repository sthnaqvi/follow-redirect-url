# follow-redirect-url

[![npm version](https://badge.fury.io/js/follow-redirect-url.png)](https://badge.fury.io/js/follow-redirect-url)

A simple command-line utility that lets you follow redirects to see where http URLs end up. Useful for shortened URLs.

Follows up to 20 redirects Default.

Also added User-Agent header to requests, some web address won't redirect without browsers information eg: https://fb.me

## Installation

### Install with npm globally (For CLI):
```
npm install -g follow-redirect-url
```

### Install for your project:
```
npm install -save follow-redirect-url
```

## Usage CLI:

```
follow https://bit.ly/2X7gCIT
```

## CLI Result:
```
https://bit.ly/2X7gCIT -> 301
http://github.com/sthnaqvi/follow-redirect-url -> 301
https://github.com/sthnaqvi/follow-redirect-url -> 200
```

## Examples:
``` js
'use strict';

const followRedirect = require('follow-redirect-url');

followRedirect.startFollowing('https://bit.ly/2X7gCIT').then(urls => {
    console.log(urls);
}).catch(error => {
    console.log(error)
})
```

## Result:
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