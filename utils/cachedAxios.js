// From https://github.com/kuitos/axios-extensions
const axios = require("axios");
const { cacheAdapterEnhancer } = require("axios-extensions");

const http = axios.create({
  baseURL: "/",
  headers: { "Cache-Control": "no-cache" },
  // disable the default cache and set the cache flag
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false,
    cacheFlag: "useCache",
  }),
});

module.exports = http;
