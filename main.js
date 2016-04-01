var STD_PUNCT = /[\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
var NUM_INITIAL_IMAGES = 3;
var MIN_PAGE_IMAGES = 3; //must be >= NUM_INITIAL_IMAGES
var DEFAULT_INPUT_MESSAGE = 'Guess What\'s Going on!';

var gPageTitle;

asyncGetRandomUsablePage().done(asyncQueryForAndLoadImages, setPageName);

function setPageName(pageInfo) {
   gPageTitle = new titleObject(pageInfo.title);
   console.log(gPageTitle);
}

$(document).data('readyDeferred', $.Deferred()).ready(function() {
   $(document).data('readyDeferred').resolve();

   disableButton();
   $('#f_textInput').css('color', '#9EB8A0');

   $('#f_textInput').focus(function() {
      $('#f_textInput').css('color', '#262b26');
      if ($(this).val() === DEFAULT_INPUT_MESSAGE)
         $(this).val('');
   });

   $('#f_textInput').keyup(function() {

      if ($(this).val() !== '')
         enableButton();
      else
         disableButton();
   });

   $('#f_textInput').blur(function() {
      if ($(this).val() !== '')
         enableButton();
      else {
         $(this).val(DEFAULT_INPUT_MESSAGE);
         $(this).css('color', '#9EB8A0');
         disableButton();
      }
   });

   $('#f_button').click();

}); //End $(document).ready(function() {

function findMatches(guess, title) {
   var guessWordsMatched = [];
   for (var i = 0; i < title.normTokens.length; i++) {
      for (var j = 0; j < guess.normTokens.length; j++) {
         if (title.normTokens[i] === guess.normTokens[j]) {
            if (guess.guessed[j] === 0) {
               guess.guessed[j] = 1;
               title[i] = 1;
               guessWordsMatched.push(j);
            }
         }
      }
   }
   return guessWordsMatched;
}

function submitAction() {
   var guess = new titleObject($('#f_textInput').val());
   var wordsMatched = findMatches(guess, gPageTitle);
   console.log(wordsMatched.sort());
}

function titleObject(str) {
   this.origString = str;
   this.origTokens = str.match(/\S+/g); //original chars/punct
   this.normTokens =
      diacritics2url.replaceDiacritics(str.toLowerCase().replace(STD_PUNCT, '')).match(/\S+/g);
   this.guessed = zeroArray(this.origTokens.length);
}

function zeroArray(l) {
   var res = new Array(l);
   while (--l >= 0) {
      res[l] = 0;
   }
   return res;
}

function disableButton() {
   $('#f_button').attr('disabled', 'true');
   $('.buttonLabel').css('color', '#9EB8A0');
}

function enableButton() {
   $('#f_button').removeAttr('disabled');
   $('.buttonLabel').css('color', '#444f45');
}

function isUnusableImage(imageTitle, pageTitle) {
   console.log("comparing " + imageTitle + " & " + pageTitle);
   if (!imageTitle.includes(pageTitle)) {
      console.log("\t" + imageTitle + " !== " + pageTitle);
      return true;
   }
   return false;
}

function filterUnusableImages(imageArray, pageTitle) {
   //filter out those dumb article metadata images that are sometimes delivered
   if (imageArray != null) { // != is intentional, checks for undefined
      for (var i = imageArray.length - 1; i >= 0; i--) {
         if (isUnusableImage(imageArray[i].title, pageTitle))
            imageArray.splice(i, 1);
      }
   }
}

function asyncGetRandomUsablePage() {
   /* Handles the work of getting information about a random 
   article and determining whether it will be usable*/
   var deff = $.Deferred();
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
         console.log("raw page images: ");
         console.log(JSON.stringify(pageInfo.images));
         var pageImages = pageInfo.images;
         console.log(pageInfo.fullurl);

         filterUnusableImages(pageImages, pageInfo.title);

         if (pageImages == null || // == is intentional, checks for undefined
            pageImages.length < MIN_PAGE_IMAGES ||
            pageInfo.title.length > 256) {

            return asyncGetRandomUsablePage(); //try again
         }
         deff.resolve(pageInfo);
      }
   });
   return deff.promise();
}

function asyncQueryForAndLoadImages(pageInfo) {
   var deff = $.Deferred();
   $.ajax({ //make another async. request for image urls
      url: synthImageInfoQuery(pageInfo.images),
      dataType: 'jsonp',
      success: function(jsonpData) {
         //create array and fill w/ slightly more accessable image data
         var images = [];
         var keys = Object.keys(jsonpData.query.pages);

         for (var i = 0; i < keys.length; i++) {
            //put image objects in new array
            var current = jsonpData.query.pages[keys[i].toString()];
            images.push(current);
         }

         for (var i = 0; i < NUM_INITIAL_IMAGES && images.length !== 0; i++) {
            //Get random int in range [0, images.length-1]
            var randIndex = Math.floor(Math.random() * images.length);

            var nextImageInfo = images[randIndex].imageinfo[0];
            console.log(nextImageInfo);

            images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down

            $.when($(document).data('readyDeferred')).then(function() {
               if ($('#img' + i).length) { //if image (placeholder) element exists 
                  $('#img' + i).attr('src', nextImageInfo.url);
               } else {
                  $('.wrap').append(synthImageHtml(nextImageInfo, i));
               }
            });
         }
      }
   });
}

function synthImageInfoQuery(pageImages) {
   //base url to query api for image sources
   var queryUrl = 'https://www.wikihow.com/api.php?action=query&format=json&prop=imageinfo&titles=';
   //append image titles seperated by '%7C' (url encoded '|')
   for (var i = 0; i < pageImages.length; i++) {
      queryUrl = queryUrl + pageImages[i].title;
      if (i < pageImages.length - 1)
         queryUrl = queryUrl + '%7C'; //url-encoded '|'
      else
         queryUrl = queryUrl + '&iiprop=url%7Csize&iiurlwidth=500'; //additional query properties
   }
   queryUrl = queryUrl.replace(/ /g, '+'); //url-encode spaces
   return queryUrl;
}

function synthImageHtml(nextImageInfo, i) {
   var imgTag = '<img class="pageImage" src="' + nextImageInfo.url + '" id="img' + i + '" />';
   return '<div class="box floatyWrapper">\n' + imgTag + '\n</div>\n';
}

function setFixedInputPosition() {
   $("#f_area").css("bottom", Math.max(0, ($(document).scrollTop() + $(window).height()) - $(".siteFooter").offset()['top']));
}
document.body.addEventListener('touchmove', setFixedInputPosition);
$(window).scroll(setFixedInputPosition);
$(window).resize(setFixedInputPosition);
