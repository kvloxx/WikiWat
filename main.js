$(document).ready(function() {
	$.ajax({ 	//get random page using mediawiki API
		url: 'http://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&generator=random&inprop=url&imlimit=100&grnnamespace=0',
		dataType: 'jsonp',
		success: function(jsonpData) {
			var page = jsonpData.query.pages;
			var pageId = Object.keys(page)[0];
			var pageInfo = page[pageId.toString()];
			var pageUrl = pageInfo.fullurl;
			var pageImages = pageInfo.images;

			console.log(pageUrl);

			if (pageImages == null) { // == is correct, checks for undefined
				$.ajax({	//make a request for a different article
					url: this.url,
					dataType: this.dataType,
					success: this.success	
				}); 
			}

			//base url to query api for image sources
			var queryUrl = 'http://www.wikihow.com/api.php?action=query&format=json&prop=imageinfo&titles=';
			//append image titles seperated by '%7C' (url encoded '|')
			for (var i = 0; i < pageImages.length; i++) { 
				queryUrl = queryUrl + pageImages[i].title;
				if (i < pageImages.length - 1)
					queryUrl = queryUrl + '%7C'; //url-encoded '|'
				else
					queryUrl = queryUrl + '&iiprop=url'; //additional query properties
			}
			queryUrl = queryUrl.replace(/ /g, '+'); //url-encode spaces

			$.ajax({	//make another async. request for image urls
				url: queryUrl,
				dataType: 'jsonp',
				success: function(jsonpData) {
					//create array and fill w/ slightly more accessable image data
					var images = [];	
					var keys = Object.keys(jsonpData.query.pages);
					for (var i = 0; i < keys.length; i++) {
						images.push(jsonpData.query.pages[keys[i].toString()]);
					}

					for (var i = 0; i < 3 && images.length !== 0; i++) {
						var randIndex = Math.floor(Math.random() * images.length); //random int in range [0, images.length-1]
						console.log(randIndex);
						console.log(images[randIndex].imageinfo[0]);
						var imgTag = '<img src="' + images[randIndex].imageinfo[0].url + '" height="300px" class="image" id="image' + i + '">';
						images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down
						$(".imgContainer").append(imgTag);
					}
				}
			});
		}
	});
});