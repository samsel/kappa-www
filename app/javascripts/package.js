define(['jquery', 'jsonHuman'], function ($, JsonHuman) {
	$('#info').append(JsonHuman.format(window.packageInfo)).slideDown(1000);
});