var readability = require('node-readability');

function message(msg){
	if (typeof msg != "undefined") {
		alert(msg)
	} else {
		null
	}
}

function reader(){
	var error;

	url = $("#url").val()
	
	if (url == "" || typeof url == "undefined") {
		error = "url was not defined"

	} else {
		readability.read(url, function(err, article){
			if (err) throw err;
			content = article.getContent();
			view = $("#view");
			view.html(content);
			return 0;
		});
	}

	message(error);
	return 0;
}