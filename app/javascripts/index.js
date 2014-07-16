var app = function () {
	var searchInput = $('#search');
	if (searchInput.length) {

		var url = searchInput.attr('data-url');

		searchInput.on('keyup', function (e) {

			// start searching only if the user
			// enters more that one character.
			if (searchInput.val().length > 1) {
				var xhr = $.ajax({
					url: url + searchInput.val(),
					method: "GET"
				});

				xhr.done(function () {		
					console.log(xhr.responseJSON.packages);
				});

				xhr.fail(function () {
					console.error(" oops! not good enough to handle like this :(- ");
				});
			}
		});
	}
};

$(app);