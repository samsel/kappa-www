'use strict';

var $ = require('jquery');
// fix this hack using browserify-shim
window.jQuery = $;

var typeahead = require('typeahead.js');

var searchInput = $('#search');
var url = searchInput.attr('data-url');

searchInput.on('typeahead:selected', function() {
  window.location.href = '/' + searchInput.val();
});

var typeaheadConfig = {
  minLength: 1
};

function typeaheadSource(query, process) {
  var xhr = $.ajax({
    url: url + query,
    method: 'GET'
  });

  xhr.done(function() {
    process(xhr.responseJSON);
  });

  xhr.fail(function() {
    console.error('oops! not good enough to handle like this :(- ');
  });
}

var typeaheadMeta = {
  name: 'packages',
  displayKey: 'name',
  source: typeaheadSource
};

searchInput.typeahead(typeaheadConfig, typeaheadMeta);
