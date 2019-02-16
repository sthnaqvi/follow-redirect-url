# follow-redirect-url

[![npm version](https://badge.fury.io/js/follow-redirect-url.png)](https://badge.fury.io/js/follow-redirect-url)

A simple command-line utility that lets you follow redirects to see where http URLs end up. Useful for shortened URLs.

Follows up to 20 redirects Default.

Also added User-Agent header to requests, some web address won't redirect without browsers information eg: https://fb.me

## Installation

### Install with npm globally:
```
npm install -g follow-redirect-url
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