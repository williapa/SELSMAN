chrome.browserAction.onClicked.addListener(function(tab) {
	var urls = ["http://www.imdb.com/title/tt0076759/", "http://www.imdb.com/title/tt0077651"];
	for (var i = 0; i < urls.length; i++) {
		chrome.tabs.create({ url: urls[i] });
	}

	setTimeout(function() {
		chrome.tabs.creat({url: "localhost:8080/api"});
	}, 5000);
});


