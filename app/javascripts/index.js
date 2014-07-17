define(['jquery'], function ($) {

	$(function () {

		var pages = ['searchPage', 'packagePage'];

		pages.forEach(function(page) {
			if ($('#' + page).length) {
				require([page]);
			}
		});
	});
});