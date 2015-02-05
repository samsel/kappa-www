kappa-www
=========

[![Build Status](https://travis-ci.org/samsel/kappa-www.svg)](https://travis-ci.org/samsel/kappa-www)

kappa-www is an easy to setup minimal web interface for any private NPM registry reverse proxied via - [kappa](https://github.com/krakenjs/kappa "kappa").

Currently, the following two features are available in kappa-www,

* browse packages
* type-ahead search

## usage

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
            "title": "My Orgs Private NPM Browser",
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

## Run Tests

```bash
$ npm test
```
