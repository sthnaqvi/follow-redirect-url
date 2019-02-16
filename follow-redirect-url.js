'use strict';

const fetch = require('node-fetch');
fetch.Promise = Promise;
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36';
const metaRefreshPattern = '(CONTENT|content)=["\']0;[ ]*(URL|url)=(.*?)(["\']\s*>)';

const fetchOptions = {
    redirect: 'manual',
    follow: 0,
    headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html'
    }
};

const prefixWithHttp = url => {
    let pattern = new RegExp('^http');
    return pattern.test(url) ? url : 'http://' + url;
};

const isRedirect = status => status === 301 || status === 302 || status === 303 || status === 307 || status === 308;

const extractMetaRefreshUrl = html => {
    let match = html.match(metaRefreshPattern);
    return match && match.length == 5 ? match[3] : null
};

const visit = url => new Promise((resolve, reject) => {
    url = prefixWithHttp(url);
    fetch(url, fetchOptions).then(response => {
        if (isRedirect(response.status)) {
            const location = response.headers.get('location');
            if (!location) {
                throw `${url} responded with status ${response.status} but no location header`;
            };
            resolve({ url: url, redirect: true, status: response.status, redirectUrl: response.headers.get('location') });
        } else if (response.status == 200) {
            response.text().then(text => {
                const redirectUrl = extractMetaRefreshUrl(text);
                resolve(redirectUrl ?
                    { url: url, redirect: true, status: '200 + META REFRESH', redirectUrl: redirectUrl } :
                    { url: url, redirect: false, status: response.status });
            });
        } else {
            resolve({ url: url, redirect: false, status: response.status });
        };
    }).catch(reject);
});

const _startFollowingRecursively = (url, MAX_REDIRECT_LENGTH = 20, count = 1, visits = []) => new Promise((resolve, reject) => {
    if (count > MAX_REDIRECT_LENGTH) {
        return reject(`Exceeded max redirect depth of ${MAX_REDIRECT_LENGTH}`);
    };
    visit(url).then(response => {
        count++;
        visits.push(response);
        url = response.redirectUrl;
        if (response.redirect) {
            resolve(_startFollowingRecursively(url, MAX_REDIRECT_LENGTH, count, visits));
        } else {
            resolve(visits);
        };
    }).catch(error => {
        visits.push({ url: url, redirect: false, status: `Error: ${error}` });
        resolve(visits);
    });
});

/**
 * 
 * @param {String} url pass url like http://google.com
 * @param {Number} MAX_REDIRECT_LENGTH set max redirect limit Default 20
 */
module.exports.startFollowing = (url, MAX_REDIRECT_LENGTH) => _startFollowingRecursively(url, MAX_REDIRECT_LENGTH);