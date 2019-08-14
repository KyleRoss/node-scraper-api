"use strict";
const { URLSearchParams } = require('url');
const got = require('got');

/**
 * @external form-data
 * @see https://github.com/form-data/form-data
 */

/**
 * @typicalname scraperAPI
 */
class ScraperAPI {
    /**
     * Constructor for the ScraperAPI class.
     * @param {Object} [options={}] Options for the ScraperAPI class. Options may be overridden on all methods for a single request. See options above for more information.
     */
    constructor(options={}) {
        this._opts = Object.assign({
            apiKey: process.env.SCRAPER_API_KEY,
            renderJs: false,
            keepHeaders: false,
            geoCode: 'us',
            premium: false,
            sessionId: null,
            gotOptions: {}
        }, options);
    }
    
    /**
     * Creates a new instance of ScraperAPI with the specified session id. Sessions allow subsequent requests with the same session id to go through 
     * the same proxy. See [documentation](https://www.scraperapi.com/documentation#sessions) for more information.
     * @param {Number} id Session ID in which to use for the given session. Must only contain numbers.
     * @param {Object} [options={}] Options to override for all subsequent requests to Scraper API. Same as the global options.
     * @returns {ScraperAPI} A new instance of ScraperAPI with `sessionId` set to the provided id.
     * 
     * @example 
     * const session = scraperAPI.session(1234);
     * 
     * let result = await scraperAPI.get('https://google.com');
     * // result -> '<!doctype html> ...'
     */
    session(id, options={}) {
        if(!id) throw new Error('Session ID must be provided');
        if(typeof id === 'string' && !id.match(/^[0-9]+$/)) throw new Error('Session ID must be numeric');
        
        let opts = Object.assign({}, this._opts, { sessionId: id }, options);
        return new ScraperAPI(opts);
    }
    
    /**
     * Calls Scraper API with a GET request to the provided url.
     * @param {String} url The URL in which to scrape.
     * @param {Object} [options={}] Options to override for this specific request.
     * @returns {Promise<String>} Promise that resolves with HTML source from requested URL.
     * 
     * @example 
     * let result = await scraperAPI.get('https://google.com');
     * // result -> '<!doctype html> ...'
     */
    get(url, options={}) {
        return this._callAPI({
            query: this._generateQuery(url, options)
        });
    }
    
    /**
     * Calls Scraper API with a POST request to the provided url with the provided data.
     * @param {String} url The URL in which to scrape.
     * @param {Object|external:form-data} data Data in which to post to the provided URL. Must be either a plain object or instance of [form-data](https://github.com/form-data/form-data).
     * @param {Object} [options={}] Options to override for this specific request. May be any of the global options and any additional options below.
     * @param {Boolean} [options.form=false] Set `true` if provided `data` is form data and should be sent as such. By default, data will be sent as JSON.
     * @returns {Promise<Object>} Promise that resolves with object response from Scraper API. See [documentation](https://www.scraperapi.com/documentation#post-requests).
     * 
     * @example 
     * let result = await scraperAPI.post('https://example.com/endpoint', {
     *    hello: 'world',
     *    some: 'data'
     * });
     */
    post(url, data, options={}) {
        let opts = {
            query: this._generateQuery(url, options),
            body: data,
            method: 'POST'
        };
        
        if(options.form) opts.form = true;
        else opts.json = true;
        
        return this._callAPI(opts);
    }
    
    /**
     * Generic method to call Scraper API.
     * @private 
     * @param {Object} options Got options to use for this specific request.
     * @returns {Promise<String|Object>} Response body from the request.
     */
    _callAPI(options) {
        const opts = Object.assign({}, this._opts.gotOptions, options);
        return new Promise((resolve, reject) => {
            got('http://api.scraperapi.com/', opts)
                .then(({ body }) => {
                    if(opts.method === 'POST' && opts.form) {
                        body = JSON.parse(body);
                    }
                    resolve(body);
                })
                .catch(err => {
                    if(err.response && err.response.body) err.message = err.response.body;
                    reject(err);
                });
        });
    }
    
    /**
     * Generates the URLSeachParams instance for a request to Scraper API.
     * @private 
     * @param {String} url The URL in which to have Scraper API scrape.
     * @param {Object} [opts={}] Options to override from the global options.
     * @returns {URLSearchParams} Compiled query string parameters.
     */
    _generateQuery(url, opts={}) {
        opts = Object.assign({}, this._opts, opts);
        let params = new URLSearchParams({
            url,
            api_key: opts.apiKey
        });
        
        if(opts.renderJs) params.set('render', 'true');
        if(opts.keepHeaders) params.set('keep_headers', 'true');
        if(opts.sessionId) params.set('session_number', opts.sessionId);
        if(opts.geoCode) params.set('country_code', opts.geoCode);
        if(opts.premium) params.set('premium', 'true');
        
        return params;
    }
}

module.exports = ScraperAPI;
