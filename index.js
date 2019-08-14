"use strict";
/**
 * @module scraper-api
 */

const ScraperAPI = require('./lib/ScraperAPI');

/**
 * Creates new instance of ScraperAPI with the provided options.
 * @alias module:scraper-api
 * @param {Object} options Optional configuration options to pass into ScraperAPI.
 * @param {String} [options.apiKey=process.env.SCRAPER_API_KEY] API key for Scraper API. Defaults to pulling API Key from environment variable. 
 * @param {Boolean} [options.renderJs=false] Render JavaScript on the page before scraping the HTML for the page.
 * @param {Boolean} [options.keepHeaders=false] Keep headers sent in the request to Scraper API in subsequent request(s) when scraping the provided url. You must set your headers in `options.gotOptions.headers`.
 * @param {String} [options.geoCode='us'] Geo code in which to use proxies for when scraping. See [documentation](https://www.scraperapi.com/documentation#geographic-location) for more information.
 * @param {Boolean} [options.premium=false] Whether to use premium proxies. **Caution:** This will cost 10-25 times more than standard proxies.
 * @param {Number} [options.sessionId] A numeric session id to use to maintain the same proxy. See [ScraperAPI.session()](#) for more information.
 * @param {Object} [options.gotOptions={}] Additional options to pass into [got](https://www.npmjs.com/package/got) for requests to ScraperAPI.
 * @returns {ScraperAPI} New instance of ScraperAPI.
 * 
 * @example 
 * const scraperAPI = require('scraper-api')({
 *     // options...
 * });
 */
function scraperAPI(options) {
    return new ScraperAPI(options);
}

/**
 * Access to the uninstantiated ScraperAPI class.
 * @example 
 * const ScraperAPI = require('scraper-api').ScraperAPI;
 * const scraperAPI = new ScraperAPI({
 *     // options...
 * });
 */
scraperAPI.ScraperAPI = ScraperAPI;

module.exports = scraperAPI;
