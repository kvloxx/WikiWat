var STD_PUNCT = /[\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
var NUM_INITIAL_IMAGES = 3;
var MIN_PAGE_IMAGES = 3; //must be >= NUM_INITIAL_IMAGES
var DEFAULT_INPUT_MESSAGE = 'Guess the Title of This Article!';
var $DOC = $(document);

var promisedUsablePage = asyncQueryForRandomUsablePage();
$.when( //coordinates page loading (a masterpiece)
   promisedUsablePage.then(asyncQueryForPageImages),
   $DOC.data('readyDeferred')
).done(addImagesToDocument);

$DOC.data('readyDeferred', $.Deferred()).ready(function() {
   var $textInput = $('#f_textInput');
   $.when(promisedUsablePage).done(function(pageInfo) {
      $DOC.data('wikiPageTitle', new titleObject(pageInfo.title));
   });

   $DOC.data('readyDeferred').resolve();

   disableButton();
   $textInput.css('color', '#A6C090');

   $(window).scroll(setFixedInputPosition);
   $(window).resize(setFixedInputPosition);

   $textInput.focus(focusedAction);
   $textInput.keyup(keyupAction);
   $textInput.blur(blurAction);

   $('#mobile_menuToggle').change(slideMenuUp);
   slideMenuUp();
      
}); //End $DOC.ready

function slideMenuUp() {
   console.log("BUH");

   if (!$(this).is(":checked")) {
      $('.slide-menu').css({ "transform": "translate(0,-"+$('#mobile_menuContent').height()+"px)" });
      $('#mobile_menuIcon_up').css({ "transform": "rotate(180deg)" });
   } else {
      $('.slide-menu').css({ "transform": "translate(0,0)" });
      $('#mobile_menuIcon_up').css({ "transform": "rotate(0deg)" });
   }
}
function asyncQueryForRandomUsablePage() {
   /* request random article and see if it has enough usable images*/
   return $.ajax({ //get random page using mediawiki API
      url: 'https://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&generator=random&inprop=url&imlimit=100&grnnamespace=0',
      dataType: 'jsonp'
   }).then(function(data) {
      /*The mediawiki api answers our request with a complex json object structure.
      However, all of the data we're interested in is kept in a sub-object, "pageInfo"
      Accessing it requires making this series of calls:
         var page = jsonpData.query.pages;
         var pageId = Object.keys(page)[0];
         var pageInfo = page[pageId.toString()];
      To avoid creating extra variables, I condense this to the single unreadable line below: */
      var pageInfo = data.query.pages[Object.keys(data.query.pages)[0].toString()];

      console.log(pageInfo.fullurl);
      console.log("raw page images: ");
      console.log(JSON.stringify(pageInfo.images));

      filterUnusableImages(pageInfo.images);

      if (pageInfo.images == null || // == is intentional, checks for undefined
         pageInfo.images.length < MIN_PAGE_IMAGES ||
         pageInfo.title.length > 256) {

         return asyncQueryForRandomUsablePage(); //try again
      }
      return pageInfo;
   });
}

function asyncQueryForPageImages(pageInfo) {
   return $.ajax({ //make another async. request for image urls
      url: synthImageInfoQuery(pageInfo.images),
      dataType: 'jsonp'
   }).then(function(data) {
      //create array and fill w/ slightly more accessable image data
      var images = [];
      var keys = Object.keys(data.query.pages);

      for (var i = 0; i < keys.length; i++) {
         //put image objects in new array
         var current = data.query.pages[keys[i].toString()];
         images.push(current);
      }
      return images;
   });
}

function addImagesToDocument(images, a2) { //argument a2 is extra passed in from $.when().done() 
   for (var i = 0; i < NUM_INITIAL_IMAGES && images.length !== 0; i++) {
      //Get random int in range [0, images.length-1]
      var randIndex = Math.floor(Math.random() * images.length);

      var nextImageInfo = images[randIndex].imageinfo[0];
      console.log(nextImageInfo);

      images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down 1

      if ($('#img' + i).length) //if image (placeholder) element exists 
         $('#img' + i).attr('src', nextImageInfo.url);
      else
         $('.wrap').append(synthImageHtml(nextImageInfo, i));
   }
}

function focusedAction() {
   $(this).css('color', '#262b26');
   if ($(this).val() === DEFAULT_INPUT_MESSAGE)
      $(this).val('');
}

function keyupAction() {
   if ($(this).val() !== '')
      enableButton();
   else
      disableButton();
}

function blurAction() {
   if ($(this).val() !== '')
      enableButton();
   else {
      $(this).val(DEFAULT_INPUT_MESSAGE);
      $(this).css('color', '#A6C090');
      disableButton();
   }
}

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
   var wordsMatched = findMatches(guess, $DOC.data('wikiPageTitle'));
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

function isUnusableImage(imageTitle) {
   console.log("checking " + imageTitle);
   if (UNUSABLE_IMAGES.includes(imageTitle)) {
      console.log("\t" + imageTitle + " unusable.");
      return true;
   }
   return false;
}

function filterUnusableImages(imageArray) {
   //filter out those dumb article metadata images that are sometimes delivered
   if (imageArray != null) { // != is intentional, checks for undefined
      for (var i = imageArray.length - 1; i >= 0; i--) {
         if (isUnusableImage(imageArray[i].title))
            imageArray.splice(i, 1);
      }
   }
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
   if (window.innerWidth > 541)
      $("#f_area").css("bottom", Math.max(0, ($DOC.scrollTop() + $(window).height()) - $(".siteFooter").offset().top));
   else
      $("#f_area").css("bottom", 0);
}
