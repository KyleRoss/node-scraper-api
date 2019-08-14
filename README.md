# scraper-api
[![npm](https://img.shields.io/npm/v/scraper-api.svg?style=for-the-badge)](https://www.npmjs.com/package/scraper-api) [![npm](https://img.shields.io/npm/dt/scraper-api.svg?style=for-the-badge)](https://www.npmjs.com/package/scraper-api) [![David](https://img.shields.io/david/KyleRoss/node-scraper-api.svg?style=for-the-badge)](https://david-dm.org/KyleRoss/node-scraper-api) [![Travis](https://img.shields.io/travis/KyleRoss/node-scraper-api/master.svg?style=for-the-badge)](https://travis-ci.org/KyleRoss/node-scraper-api) [![Coveralls](https://img.shields.io/coveralls/github/KyleRoss/node-scraper-api.svg?style=for-the-badge)](https://coveralls.io/github/KyleRoss/node-scraper-api) [![license](https://img.shields.io/github/license/KyleRoss/node-scraper-api.svg?style=for-the-badge)](https://github.com/KyleRoss/node-scraper-api/blob/master/LICENSE) [![Beerpay](https://img.shields.io/beerpay/KyleRoss/node-scraper-api.svg?style=for-the-badge)](https://beerpay.io/KyleRoss/node-scraper-api)

Interface to call [ScraperAPI.com](https://www.scraperapi.com) easily from Node. All current API endpoints and features are implemented in this module. Requires Node 8+.

## Install

```bash
$ npm install --save scraper-api
```

## Usage
```js
const scraperAPI = require('scraper-api')({
    // ... options
});

scraperAPI.get('http://httpbin.org/ip')
    .then(result => {
        // result => '<!doctype html> ...'
    })
    .catch(error => {
        console.error(error);
        //=> 'Internal server error'
    });
```

# API Documentation
<a name="module_scraper-api"></a>

## scraper-api

* [scraper-api](#module_scraper-api)
    * [scraperAPI(options)](#exp_module_scraper-api--scraperAPI) ⇒ [<code>ScraperAPI</code>](#ScraperAPI) ⏏
        * [.ScraperAPI](#module_scraper-api--scraperAPI.ScraperAPI)

<a name="exp_module_scraper-api--scraperAPI"></a>

### scraperAPI(options) ⇒ [<code>ScraperAPI</code>](#ScraperAPI) ⏏
Creates new instance of ScraperAPI with the provided options.

**Kind**: Exported function  
**Returns**: [<code>ScraperAPI</code>](#ScraperAPI) - New instance of ScraperAPI.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Optional configuration options to pass into ScraperAPI. |
| [options.apiKey] | <code>String</code> | <code>process.env.SCRAPER_API_KEY</code> | API key for Scraper API. Defaults to pulling API Key from environment variable. |
| [options.renderJs] | <code>Boolean</code> | <code>false</code> | Render JavaScript on the page before scraping the HTML for the page. |
| [options.keepHeaders] | <code>Boolean</code> | <code>false</code> | Keep headers sent in the request to Scraper API in subsequent request(s) when scraping the provided url. You must set your headers in `options.gotOptions.headers`. |
| [options.geoCode] | <code>String</code> | <code>&#x27;us&#x27;</code> | Geo code in which to use proxies for when scraping. See [documentation](https://www.scraperapi.com/documentation#geographic-location) for more information. |
| [options.premium] | <code>Boolean</code> | <code>false</code> | Whether to use premium proxies. **Caution:** This will cost 10-25 times more than standard proxies. |
| [options.sessionId] | <code>Number</code> |  | A numeric session id to use to maintain the same proxy. See [ScraperAPI.session()](#) for more information. |
| [options.gotOptions] | <code>Object</code> | <code>{}</code> | Additional options to pass into [got](https://www.npmjs.com/package/got) for requests to ScraperAPI. |

**Example**  
```js
const scraperAPI = require('scraper-api')({
    // options...
});
```
<a name="module_scraper-api--scraperAPI.ScraperAPI"></a>

#### scraperAPI.ScraperAPI
Access to the uninstantiated ScraperAPI class.

**Kind**: static property of [<code>scraperAPI</code>](#exp_module_scraper-api--scraperAPI)  
**Example**  
```js
const ScraperAPI = require('scraper-api').ScraperAPI;
const scraperAPI = new ScraperAPI({
    // options...
});
```
<a name="ScraperAPI"></a>

## ScraperAPI
**Kind**: global class  

* [ScraperAPI](#ScraperAPI)
    * [new ScraperAPI([options])](#new_ScraperAPI_new)
    * [scraperAPI.session(id, [options])](#ScraperAPI+session) ⇒ [<code>ScraperAPI</code>](#ScraperAPI)
    * [scraperAPI.get(url, [options])](#ScraperAPI+get) ⇒ <code>Promise.&lt;String&gt;</code>
    * [scraperAPI.post(url, data, [options])](#ScraperAPI+post) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_ScraperAPI_new"></a>

### new ScraperAPI([options])
Constructor for the ScraperAPI class.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Options for the ScraperAPI class. Options may be overridden on all methods for a single request. See options above for more information. |

<a name="ScraperAPI+session"></a>

### scraperAPI.session(id, [options]) ⇒ [<code>ScraperAPI</code>](#ScraperAPI)
Creates a new instance of ScraperAPI with the specified session id. Sessions allow subsequent requests with the same session id to go through 
the same proxy. See [documentation](https://www.scraperapi.com/documentation#sessions) for more information.

**Kind**: instance method of [<code>ScraperAPI</code>](#ScraperAPI)  
**Returns**: [<code>ScraperAPI</code>](#ScraperAPI) - A new instance of ScraperAPI with `sessionId` set to the provided id.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Number</code> |  | Session ID in which to use for the given session. Must only contain numbers. |
| [options] | <code>Object</code> | <code>{}</code> | Options to override for all subsequent requests to Scraper API. Same as the global options. |

**Example**  
```js
const session = scraperAPI.session(1234);

let result = await scraperAPI.get('https://google.com');
// result -> '<!doctype html> ...'
```
<a name="ScraperAPI+get"></a>

### scraperAPI.get(url, [options]) ⇒ <code>Promise.&lt;String&gt;</code>
Calls Scraper API with a GET request to the provided url.

**Kind**: instance method of [<code>ScraperAPI</code>](#ScraperAPI)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Promise that resolves with HTML source from requested URL.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL in which to scrape. |
| [options] | <code>Object</code> | <code>{}</code> | Options to override for this specific request. |

**Example**  
```js
let result = await scraperAPI.get('https://google.com');
// result -> '<!doctype html> ...'
```
<a name="ScraperAPI+post"></a>

### scraperAPI.post(url, data, [options]) ⇒ <code>Promise.&lt;Object&gt;</code>
Calls Scraper API with a POST request to the provided url with the provided data.

**Kind**: instance method of [<code>ScraperAPI</code>](#ScraperAPI)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Promise that resolves with object response from Scraper API. See [documentation](https://www.scraperapi.com/documentation#post-requests).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL in which to scrape. |
| data | <code>Object</code> \| [<code>form-data</code>](https://github.com/form-data/form-data) |  | Data in which to post to the provided URL. Must be either a plain object or instance of [form-data](https://github.com/form-data/form-data). |
| [options] | <code>Object</code> | <code>{}</code> | Options to override for this specific request. May be any of the global options and any additional options below. |
| [options.form] | <code>Boolean</code> | <code>false</code> | Set `true` if provided `data` is form data and should be sent as such. By default, data will be sent as JSON. |

**Example**  
```js
let result = await scraperAPI.post('https://example.com/endpoint', {
   hello: 'world',
   some: 'data'
});
```
---

## More Information

### keepHeaders Option
If you would like to pass custom headers through Scraper API to the destination, you may do so by setting your custom headers in `options.gotOptions.headers` and enabling this option.

```js
let result = await scraperAPI.get('https://google.com', {
    keepHeaders: true,
    gotOptions: {
        headers: {
            'My-Custom-Header': 'some value'
        }
    }
});
```

---

## Tests
Tests are written and provided as part of the module. You may run the tests by calling:

```bash
$ npm run test
```

## License
MIT License. See [License](https://github.com/KyleRoss/node-scraper-api/blob/master/LICENSE) in the repository.
