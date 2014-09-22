kappa-www
=========

[![Build Status](https://travis-ci.org/samsel/kappa-www.svg)](https://travis-ci.org/samsel/kappa-www)

kappa-www is a minimal web interface for any private NPM registry reverse proxied via - [kappa](https://github.com/krakenjs/kappa "kappa"). kappa-www is easy to setup and serves HTML responses for browser based requests to the private registry.

## features
----------------
* browse packages
* simple search

## pre-requisites
-----------------
* bower - make sure that the bower is installed globally.
* kappa > 1.x is required!

## usage
--------

```bash
$ npm init
$ npm install --save kappa kappa-www

# add start script to package.json:
#    "scripts": {
#        "start": "kappa -c config.json",
#    }
```

```javascript
// add the config.json file 
{
    "servers": [
        {
            "host": "localhost",
            "port": 8000
        }
    ],
    "plugins": {
        "kappa-www": {
            "title": "My Orgs Private NPM Browser"
            "registry": "http://npm.myorg.com/",
            "gitDomain": ["github.yourdomain.com"] //(defaults to github.com)    
        },
        "kappa": {
            "paths": [
                "http://npm.myorg.com/",
                "https://registry.npmjs.org/"
            ]
        }
    }
}
```

```shell
$ npm start
# open the below url in a browser
$ open http://localhost:8000/
````

```bash
# to clear cache and clean the local datastore
$ kappa-www clean
```

## todo
--------
* handle errors properly
* remove the ```if err``` in the code and write it nice n clean
* asset packaging
* user management

## misc
--------
* To Lint: ```npm run lint```