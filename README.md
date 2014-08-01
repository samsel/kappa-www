kappa-www
=========

## prerequisites
----------------
* Make sure that the following things are installed in your system
* Java
* Elasticsearch (installed and running on port 9200)
* bower, node module (installed globally)
* npm2es, node module (installed globally)
* before you configure and start kappa-www, index your private registry into elasticsearch by running the below command

```shell
$ npm2es --couch="http://ip_address:port/registry/" --es="http://localhost:9200/npm"
```

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
    "kappa-www": "git@github.com:samsel/kappa-www.git#master"
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
        "kappa-www": {
            "vhost": "localhost",
            "title": "My Orgs Private NPM Browser"
            "registry": "http://npm.myorg.com/",
            "elasticsearch": {
                "url": "http://localhost:9200/",
                "index": "npm"
            }            
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

## Todo
--------
* handle errors properly
* remove the stupid ```if err``` in the code and write it nice n clean
* asset packaging
* user management
* tune elastic search
* redis cache