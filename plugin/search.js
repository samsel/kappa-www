'use strict';

var elasticsearch = require('elasticsearch'),
    config = require('../config');


module.exports = function (options) {

    var client = new elasticsearch.Client({
        host: options.elasticsearch.url //,log: 'trace'
    });

    return function (key, callback) {

        var searchQuery = {
            index: options.elasticsearch.index,
            fields: ['name', 'description', 'author'],
            size: config.search.maxResults,
            body: {
                "query" : {
                    "dis_max": {
                        "tie_breaker": 0.7,
                        "boost": 1.2,
                        "queries": [
                            {
                                "bool": {
                                    "should": [
                                        {"match_phrase": {"name": key} },
                                        {"match_phrase": {"description": key} },
                                        {"match_phrase": {"author": key} },
                                        {"match_phrase": {"keywords": key} },
                                        {"match_phrase": {"readme": key} },
                                        {"match_phrase": {"description": key} },
                                        {"match_phrase": {"maintainers.name": key} }
                                    ],
                                    "minimum_should_match": 1,
                                    "boost": 50
                                }
                            }
                        ]
                    }
                }
            }
        };
      

        client.search(searchQuery, function (error, response) {
            if (error) { throw error; }
            callback(null, response.hits.hits);
        });
    };
};