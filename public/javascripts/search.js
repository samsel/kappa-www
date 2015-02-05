define(['jquery', 'typeahead'], function search($) {

  var searchInput = $('#search');
  var url = searchInput.attr('data-url');

  searchInput.on('typeahead:selected', function onTypeAheadSelected() {
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
});
