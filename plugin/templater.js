var handlebars = require('handlebars');

handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});   

module.exports.engine = handlebars;