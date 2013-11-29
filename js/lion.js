var readability = require('node-readability');
var async = require("async");

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function onRecentClick(option){
	url = $("#url");
	recentUrl = option
	url.attr("value", recentUrl)
	return 0;
}

data = {
	createDatabase: function(name, desc) {
		var db = openDatabase(name, '1.0', desc, 2 * 1024 * 1024);
		return db;
	},
	createTable: function(table) {
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS '+table+' (id, text)');
			console.log(table+" created.")
		});
	},
	appendTo: function(k, v, db, table){
		db.transaction(function (tx) {
		  cmd = 'INSERT INTO '+table+' (id, text) VALUES ('+k+', "'+v+'")'
		  tx.executeSql(cmd);
		  updateRecent();
		});
	},
	getTable: function(db, table, callback){
		db.transaction(function (tx) {
		  tx.executeSql('SELECT * FROM '+table, [], function (tx, results) {
		    var len = results.rows.length, i;
		    table = {}
		    for (i = 0; i < len; i++) {
		      k = i
		      v = results.rows.item(i).text
		      table[k] = v
		    }
		    console.log(table)

		    callback(table);
		  });
		});
	},
	dropTable: function(db, table){
		db.transaction(function(tx){
			tx.executeSql("DROP TABLE "+table)
		});
	}
}

db = data.createDatabase("recentLinks", "a database for recent user links");
data.createTable("urls");

function message(msg){
	if (typeof msg != "undefined") {
		alert(msg)
	} else {
		null
	}
}

function updateRecent() {
	recent = $("#recent")
	recent.html("")
	data.getTable(db, "urls", function(table){
		$.each(table, function( k, v ){
			recent.append("<option>"+v+"</option>");
		})
		
	});
}

function reader(){
	var error;

	url = $("#url").val()
	
	if (url == "" || typeof url == "undefined") {
		error = "url was not defined"

	} else {
		readability.read(url, function(err, article){
			if (err) throw err;
			title = article.getTitle();
			content = article.getContent();
			if (content == false) content = "The readable content of "+article.getDocument().title+" is unobtainable."
			view = $("#view");

			view.html("<h1>"+title+"</h1>"+content);

			async.series([
			    function(callback){
			        db.transaction(function (tx) {
					  tx.executeSql('SELECT * FROM urls', [], function (tx, results) {
					    var len = results.rows.length, i;
					    callback(null, len);
					  });
					});
			        
			    }
			],
			function(err, results){
				data.appendTo(results[0]+1, url, db, "urls")
			});


		});
	}

	message(error);
}