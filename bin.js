#!/usr/bin/env node

"use strict";

const followRedirect = require("./follow-redirect-url");

const follow = (url) =>
  followRedirect
    .startFollowing(url)
    .then((visits) =>
      visits
        .map((v) =>
          v.redirect
            ? `${v.url} -> ${v.status}`
            : `${v.url} -> ${v.status || ""}`
        )
        .forEach((v) => console.log(v))
    );

const url = process.argv[2];
if (!url) {
  console.log("Usage: follow <URL>");
  process.exit(1);
}
follow(url);
