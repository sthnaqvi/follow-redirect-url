"use strict";

const followRedirect = require("./follow-redirect-url");

exports.expandUrl = async function(url) {
  let resolvedUrlList;

  resolvedUrlList = await followRedirect.startFollowing(url, {
    ignoreSslErrors: true,
  });

  const lastUrlHop = resolvedUrlList[resolvedUrlList.length - 1];

  if(lastUrlHop.error) {
    return [false, lastUrlHop]
  }

  const resolvedUrl = resolvedUrlList[resolvedUrlList.length - 1].url;

  return [true, resolvedUrl];
}

exports.startFollowing = followRedirect.startFollowing;
