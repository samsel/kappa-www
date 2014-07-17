define(['jquery', 'typeahead'], function ($) {

	var app = function () {
		var searchInput = $('#search');
		
		if (searchInput.length) {
			var url = searchInput.attr('data-url');

			searchInput.on('typeahead:selected', function () {
				window.location.href = '/' + searchInput.val();
			});

			searchInput.typeahead({
			  minLength: 1
			},
			{
				name: 'packages',
				displayKey: 'name',
				source: function(query, process) {

					var xhr = $.ajax({
						url: url + query,
						method: "GET"
					});

					xhr.done(function () {		
						process(xhr.responseJSON.packages);
					});					

					xhr.fail(function () {
						console.error(" oops! not good enough to handle like this :(- ");
					});
				}
			});	
		}
	};

	$(app);
});