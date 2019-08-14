"use strict";
const assert = require('assert');
const scraperAPI = require('../');
const ScraperAPI = require('../lib/ScraperAPI');

describe('Module', () => {
    it('should export a function', () => {
        assert.equal(typeof scraperAPI, 'function');
    });
    
    it('should provide static to uninstantiated ScraperAPI class', () => {
        assert.equal(scraperAPI.ScraperAPI, ScraperAPI);
    });
    
    it('should return a new instance of ScraperAPI', () => {
        const inst = scraperAPI();
        assert(inst instanceof ScraperAPI);
    });
    
    it('should pass options into instance of ScraperAPI', () => {
        const inst = scraperAPI({
            apiKey: 'abc123'
        });
        
        assert.equal(inst._opts.apiKey, 'abc123');
    });
});
