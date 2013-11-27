var readability = require('readability');

function read() {
	url = $("#url").val();
	readability.parse('http://jawerty.github.io', function(article) {
	  alert(article.content());
	});
}