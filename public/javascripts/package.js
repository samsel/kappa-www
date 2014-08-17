define(['jquery', 'jsonHuman'], function ($, JsonHuman) {
	$('#info').append(JsonHuman.format(window.packageInfo)).fadeIn(300);
});