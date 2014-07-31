var elasticsearch = require('elasticsearch'),
    url = 'http://localhost:9200/',
    _ = require('underscore');

var totalResults = 12; //max results
var client = new elasticsearch.Client({
    host: url
});

//log: 'trace'

module.exports = function (key, callback) {
var searchQuery = {
      index: 'npm',
      fields : ['name','description','author'],
      size:totalResults,
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
  

      // var page = parseInt(request.query.page) || 0,
      //     pageSize = parseInt(options.perPage),
      //     totalhits =  response.hits.total,
      //     nextPage = 0; //zero for false 1 for true

      // if (totalhits > (pageSize * page + pageSize)){
      //   nextPage = 1;
      // }

    client.search(searchQuery, function (error, response) {
      if (error) {
        throw error;
      }
         
     callback(null, response.hits.hits);


      // reply.view("search", {
      //   obj: {
      //     page: page,
      //     q: key,
      //     pageSize: pageSize,
      //     hits: response.hits,
      //     np: nextPage, //flag
      //     nextPageNum: page + 1,
      //     subPage: page - 1
      //   },
      //   hits: response.hits
      // });
    });
};
