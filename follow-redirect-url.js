"use strict";

const fetch = require("node-fetch");
const https = require("https");
const http = require("http");

const prefixWithHttp = (url) => {
  let pattern = new RegExp("^http");
  return pattern.test(url) ? url : "http://" + url;
};

const isRedirect = (status) =>
  status === 301 ||
  status === 302 ||
  status === 303 ||
  status === 307 ||
  status === 308;

const extractMetaRefreshUrl = (html) => {
  const metaRefreshPattern =
    "(CONTENT|content)=[\"']0;[ ]*(URL|url)=(.*?)([\"']s*>)";
  let match = html.match(metaRefreshPattern);
  return match && match.length == 5 ? match[3] : null;
};

const visit = (url, fetchOptions) =>
  new Promise((resolve, reject) => {
    url = prefixWithHttp(url);
    fetch(url, fetchOptions)
      .then((response) => {
        if (isRedirect(response.status)) {
          const location = response.headers.get("location");
          if (!location) {
            throw `${url} responded with status ${response.status} but no location header`;
          }
          resolve({
            url: url,
            redirect: true,
            status: response.status,
            redirectUrl: response.headers.get("location"),
          });
        } else if (response.status == 200) {
          response.text().then((text) => {
            const redirectUrl = extractMetaRefreshUrl(text);
            resolve(
              redirectUrl
                ? {
                    url: url,
                    redirect: true,
                    status: "200 + META REFRESH",
                    redirectUrl: redirectUrl,
                  }
                : { url: url, redirect: false, status: response.status }
            );
          });
        } else {
          resolve({ url: url, redirect: false, status: response.status });
        }
      })
      .catch(reject);
  });

const _startFollowingRecursively = (
  url,
  options = {},
  count = 1,
  visits = []
) =>
  new Promise((resolve, reject) => {
    const {
      max_redirect_length = 20,
      request_timeout = 10000,
      ignoreSslErrors = false,
    } = options;
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36";
    const fetchOptions = {
      redirect: "manual",
      follow: 0,
      timeout: request_timeout,
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html",
      },
      // https://stackoverflow.com/questions/52478069/node-fetch-disable-ssl-verification
      agent: (parsedUrl) => {
        if (parsedUrl.protocol == "https:") {
          return new https.Agent({
            rejectUnauthorized: !ignoreSslErrors,
          });
        } else {
          return new http.Agent();
        }
      }
    };

    if (count > max_redirect_length) {
      return reject(`Exceeded max redirect depth of ${max_redirect_length}`);
    }

    visit(url, fetchOptions)
      .then((response) => {
        count++;
        visits.push(response);
        url = response.redirectUrl;
        resolve(
          response.redirect
            ? _startFollowingRecursively(url, options, count, visits)
            : visits
        );
      })
      .catch((error) => {
        visits.push({ url: url, redirect: false, error: error.code, status: `Error: ${error}` });
        resolve(visits);
      });
  });

/**
 *
 * @param {String} url - pass url like http://google.com
 * @param {Object} options - optional configuration eg:{ max_redirect_length:20, request_timeout:10000 }
 * @param {Number} options.max_redirect_length - set max redirect limit Default 20
 * @param {Number} options.request_timeout - request timeout in milliseconds Default 10000 ms
 */
module.exports.startFollowing = (url, options) =>
  _startFollowingRecursively(url, options);
