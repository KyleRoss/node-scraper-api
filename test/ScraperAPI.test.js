"use strict";
const nock = require('nock');
const assert = require('assert');
const { URLSearchParams } = require('url');
const ScraperAPI = require('../lib/ScraperAPI');

const response = require('./fixtures/response');

describe('ScraperAPI Class', () => {
    it('should set default options when none are provided', () => {
        let inst = new ScraperAPI(),
            opts = inst._opts;
        
        assert(!opts.apiKey);
        assert.equal(opts.renderJs, false);
        assert.equal(opts.keepHeaders, false);
        assert.equal(opts.geoCode, 'us');
        assert.equal(opts.premium, false);
        assert(!opts.sessionId);
        assert.equal(Object.keys(opts.gotOptions).length, 0);
    });
    
    it('should override options', () => {
        let inst = new ScraperAPI({
            apiKey: 'abc123',
            renderJs: true,
            keepHeaders: true,
            geoCode: 'uk',
            premium: true,
            sessionId: 123,
            gotOptions: {
                headers: {
                    'User-Agent': 'test'
                }
            }
        });
        let opts = inst._opts;
        
        assert.equal(opts.apiKey, 'abc123');
        assert.equal(opts.renderJs, true);
        assert.equal(opts.keepHeaders, true);
        assert.equal(opts.geoCode, 'uk');
        assert.equal(opts.premium, true);
        assert.equal(opts.sessionId, 123);
        assert.equal(Object.keys(opts.gotOptions).length, 1);
    });
    
    it('should set default apiKey to environment variable', () => {
        process.env.SCRAPER_API_KEY = 'test123';
        let inst = new ScraperAPI();
        
        assert.equal(inst._opts.apiKey, 'test123');
    });
    
    describe('session()', () => {
        let scraperAPI = new ScraperAPI({
            apiKey: '123abc'
        });
        
        it('should return a new instance with sessionId set', () => {
            let session = scraperAPI.session(123);
            
            assert(session instanceof ScraperAPI);
            assert.equal(session._opts.apiKey, '123abc');
            assert.equal(session._opts.sessionId, 123);
            assert(!scraperAPI.sessionId);
        });
        
        it('should allow custom options for new instance', () => {
            let session = scraperAPI.session(123, {
                renderJs: true
            });
            
            assert.equal(scraperAPI._opts.renderJs, false);
            assert.equal(session._opts.renderJs, true);
        });
        
        it('should throw error when session id is not provided', () => {
            assert.throws(() => {
                scraperAPI.session();
            }, (err) => {
                assert.equal(err.message, 'Session ID must be provided');
                return true;
            });
        });
        
        it('should throw error when session id is not numeric', () => {
            assert.throws(() => {
                scraperAPI.session('abc123');
            }, (err) => {
                assert.equal(err.message, 'Session ID must be numeric');
                return true;
            });
        });
    });
    
    describe('get()', () => {
        let scraperAPI = new ScraperAPI({
            apiKey: '123abc'
        });
        
        beforeEach(() => {
            nock('http://api.scraperapi.com')
                .get('/')
                .query({
                    url: 'https://httpbin.org/ip',
                    api_key: '123abc',
                    country_code: 'us'
                })
                .reply(200, response.get)
                .get('/')
                .query({
                    url: 'https://httpbin.org/ip',
                    api_key: '123abc',
                    country_code: 'uk'
                })
                .reply(200, 'uk');
        });
        
        it('should return promise', () => {
            assert(scraperAPI.get('https://httpbin.org/ip') instanceof Promise);
        });
        
        it('should return html response', async () => {
            let res = await scraperAPI.get('https://httpbin.org/ip');
            assert.equal(res, response.get);
        });
        
        it('should override global options', async () => {
            let res = await scraperAPI.get('https://httpbin.org/ip', {
                geoCode: 'uk'
            });
            assert.equal(res, 'uk');
        });
    });
    
    describe('post()', () => {
        let scraperAPI = new ScraperAPI({
            apiKey: '123abc'
        });
        
        beforeEach(() => {
            nock('http://api.scraperapi.com')
                .post('/', { foo: 'bar' })
                .query({
                    url: 'https://httpbin.org/ip',
                    api_key: '123abc',
                    country_code: 'us'
                })
                .reply(200, response.post)
                .post('/')
                .query({
                    url: 'https://httpbin.org/ip',
                    api_key: '123abc',
                    country_code: 'uk'
                })
                .reply(200, '{ "cc": "uk" }');
        });
        
        it('should return promise', () => {
            assert(scraperAPI.post('https://httpbin.org/ip', { foo: 'bar' }) instanceof Promise);
        });
        
        it('should return json response', async () => {
            let res = await scraperAPI.post('https://httpbin.org/ip', { foo: 'bar' });
            assert.equal(typeof res, 'object');
        });
        
        it('should override global options', async () => {
            let res = await scraperAPI.post('https://httpbin.org/ip', { foo: 'bar' }, {
                geoCode: 'uk'
            });
            assert.equal(res.cc, 'uk');
        });
        
        it('should send form data', async () => {
            let res = await scraperAPI.post('https://httpbin.org/ip', { foo: 'bar' }, {
                form: true
            });
            
            assert.equal(typeof res, 'object');
        });
    });
    
    describe('_callAPI()', () => {
        let scraperAPI = new ScraperAPI({
            apiKey: '123abc'
        });
        
        beforeEach(() => {
            nock('http://api.scraperapi.com')
                .get('/')
                .query({
                    api_key: 'undefined'
                })
                .reply(401, 'Test error message');
        });
        
        it('should override the default error message with one provided in body', (done) => {
            scraperAPI._callAPI({
                query: {
                    api_key: 'undefined'
                }
            })
                .then(() => done('Did not throw an error'))
                .catch(err => {
                    assert.equal(err.message, 'Test error message');
                    done();
                });
        });
    });
    
    describe('_generateQuery()', () => {
        let scraperAPI = new ScraperAPI({
            apiKey: '123abc',
            renderJs: true
        });
        
        it('should return instance of URLSearchParams', () => {
            assert(scraperAPI._generateQuery('https://google.com') instanceof URLSearchParams);
        });
        
        it('should override/combine custom options', () => {
            let res = scraperAPI._generateQuery('https://google.com', {
                renderJs: false,
                sessionId: 890,
                geoCode: null
            });
            
            assert.equal(res.get('render'), null, 'render does not equal null');
            assert.equal(res.get('session_number'), '890', 'session_number does not equal 890');
            assert.equal(res.get('country_code'), null, 'country_code does not equal null');
        });
        
        it('should set the proper query string parameters', () => {
            let res = scraperAPI._generateQuery('https://google.com', {
                renderJs: true,
                keepHeaders: true,
                geoCode: 'uk',
                premium: true
            });
            
            assert.equal(res.get('render'), 'true', 'render does not equal true');
            assert.equal(res.get('keep_headers'), 'true', 'keep_headers does not equal true');
            assert.equal(res.get('premium'), 'true', 'premium does not equal true');
            assert.equal(res.get('session_number'), null, 'session_number does not equal null');
            assert.equal(res.get('country_code'), 'uk', 'country_code does not equal uk');
        });
    });
});
