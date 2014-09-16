kappa-www
=========

[![Build Status](https://travis-ci.org/samsel/kappa-www.svg)](https://travis-ci.org/samsel/kappa-www)

kappa-www is a minimal web interface for the private npm registry reverse proxy - [kappa](https://github.com/krakenjs/kappa "kappa"). kappa-www is easy to setup and serves HTML responses for web based requests from browsers.

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
            "vhost": "localhost",
            "title": "My Orgs Private NPM Browser"
            "registry": "http://npm.myorg.com/",
            "gitDomain": "github.yourdomain.com" (defaults to github.com)    
        },
        "kappa": {
            "vhost": "localhost",
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
$ open http://localhost:8000/
````

## todo
--------
* handle errors properly
* remove the ```if err``` in the code and write it nice n clean
* asset packaging
* user management

## misc
--------
* To Lint: ```npm run lint```