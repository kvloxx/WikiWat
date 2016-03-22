var numInitImages = 5;
var minPageImages = 5;

$(document).ready(function() {
	$.ajax({ //get random page using mediawiki API
		url: 'https://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&generator=random&inprop=url&imlimit=100&grnnamespace=0',
		dataType: 'jsonp',
		success: function(jsonpData) {
			/*The mediawiki api answers our request with a complex json object structure.
			However, all of the data we're interested in is kept in a sub-object, "pageInfo"
			Accessing it requires making this series of calls:
				var page = jsonpData.query.pages;
				var pageId = Object.keys(page)[0];
				var pageInfo = page[pageId.toString()];
			To avoid creating extra variables, I condense this to the single unreadable line below: */
			var pageInfo = jsonpData.query.pages[Object.keys(jsonpData.query.pages)[0].toString()];
			var pageImages = pageInfo.images;

			console.log(pageInfo.fullurl);
			console.log(pageImages);

			//filter out that stupid "article stub" image that is sometimes delivered
			if (pageImages != null) { // != is correct, checks for undefined
				for (var i = pageImages.length - 1; i >= 0; i--) {
					if (pageImages[i].title === 'Image:Incomplete_856.gif' ||
						pageImages[i].title === 'Image:LinkFA star.jpg' ||
						pageImages[i].title === 'Image:Page discussion_71.gif') {

						pageImages.splice(i, 1);
					}
				}
			}

			if (pageImages == null || pageImages.length < minPageImages) { // == is correct, checks for undefined
				$.ajax({ //make a request for a different article
					url: this.url,
					dataType: this.dataType,
					success: this.success
				});
				return;
			}

			$.ajax({ //make another async. request for image urls
				url: synthImageInfoQuery(pageImages),
				dataType: 'jsonp',
				success: function(jsonpData) {
					//create array and fill w/ slightly more accessable image data
					var images = [];
					var keys = Object.keys(jsonpData.query.pages);
					var maxAspectRatio = 1; //tallest vert image
					var minAspectRatio = 1; //widest horiz image
					for (var i = 0; i < keys.length; i++) {
						//put image objects in new array
						var current = jsonpData.query.pages[keys[i].toString()];
						var currentInfo = current.imageinfo[0];
						images.push(current);

						//assign new aspect ratio property to each image
						currentInfo.aspectratio = currentInfo.height / currentInfo.width;
						var currentAspect = currentInfo.aspectratio;
						console.log(currentAspect);

						//identify most extreme aspect ratios to use later for creating layout
						if (currentAspect < minAspectRatio)
							minAspectRatio = currentAspect;
						if (currentAspect > maxAspectRatio)
							maxAspectRatio = currentAspect;
					}

					console.log('maxspect: ' + maxAspectRatio);
					console.log('minspect: ' + minAspectRatio);


					for (var i = 0; i < numInitImages && images.length !== 0; i++) {
						//Get random int in range [0, images.length-1]
						var randIndex = Math.floor(Math.random() * images.length);

						var nextImageInfo = images[randIndex].imageinfo[0];
						console.log(nextImageInfo);

						images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down

						$(".wrap").append(synthImageHtml(nextImageInfo, i));
					}
				}
			});
		}
	});
});

function synthImageInfoQuery(pageImages) {
	//base url to query api for image sources
	var queryUrl = 'https://www.wikihow.com/api.php?action=query&format=json&prop=imageinfo&titles=';
	//append image titles seperated by '%7C' (url encoded '|')
	for (var i = 0; i < pageImages.length; i++) {
		queryUrl = queryUrl + pageImages[i].title;
		if (i < pageImages.length - 1)
			queryUrl = queryUrl + '%7C'; //url-encoded '|'
		else
			queryUrl = queryUrl + '&iiprop=url%7Csize'; //additional query properties
	}
	queryUrl = queryUrl.replace(/ /g, '+'); //url-encode spaces
	return queryUrl;
}

function synthImageHtml(nextImageInfo) {
	var imgTag = '<img src="' + nextImageInfo.url;
	if (nextImageInfo.aspectratio <= 1) //specify horiz or vert image in class attribute
		imgTag = imgTag + '" class="hImage"/>';
	else
		imgTag = imgTag + '" class="vImage"/>';
	return "<div class=\"boxInner\">\n" + imgTag + "\n</div>\n";
}

function adjustAspectCSS(maxspect, minspect) {
	if ((maxspect > 1 && minspect < 1) || (maxspect === 1 && minspect === 1)) { //if there are both horiz. and vert images
		//use square boxes, default css is correct
		return;
	} else if (minspect < 1) //minspect=1, only vert or square images
	{

	}
}