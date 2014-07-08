kappa-ui
========

## usage
--------

```javascript
// add a package.json (maybe do npm init if you wish with the following and do npm install)
{
  "scripts": {
    "start": "node ./node_modules/kappa/kappa.js -c config.json"
  },
  "dependencies": {
    "kappa": "0.14.3",
    "kappa-ui": "0.0.1"
  }
}
```

```javascript
// add a config.json file to the dir
{
    "servers": [
        {
            "host": "localhost",
            "port": 8000
        }
    ],
    "plugins": {
        "kappa-ui": {
            "vhost": "localhost",
            "title": "My Orgs Private NPM Browser"
        },
        "kappa": {
            "vhost": "localhost",
            "paths": [
                "http://npm.org.com/",
                "https://registry.npmjs.org/"
            ]
        }
    }
}
```

```shell
$ npm start
$ open http://localhost:8000/pphcore
````


