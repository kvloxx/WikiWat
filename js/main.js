var STD_PUNCT = /[\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g,
   NUM_INITIAL_IMAGES = 4,
   MIN_PAGE_IMAGES = 4, //must be >= NUM_INITIAL_IMAGES
   DEFAULT_INPUT_MESSAGE = 'whatever.',
   GAMECARD_SLIDE_DELAY = 450;
   $DOC = $(document),
   promisedUsablePage = asyncQueryForRandomUsablePage();

$.when( //coordinates page loading (a masterpiece)
   promisedUsablePage.then(asyncQueryForPageImages),
   $DOC.data('readyDeferred')
).done(addImagesToDocument);

$DOC.data('readyDeferred', $.Deferred()).ready(function() {
   var $textField = $('.textField'),
      $tog = $('.toggle');

   $.when(promisedUsablePage).done(function(pageInfo) {
      $DOC.data('wikiPageTitle', new titleObject(pageInfo.title));
   });

   $DOC.data('readyDeferred').resolve();

   /*   $(window).scroll(setFixedInputPosition);
      $(window).resize(setFixedInputPosition);*/
      var $g_panel_buttons=$('.g_panel_button');
   $g_panel_buttons.blur(gPanelButtonBlurAction);
   $g_panel_buttons.click(gPanelButtonPressedAction);

   $textField.focus(focusedAction);
   $textField.keyup(keyupAction);
   $textField.blur(blurAction);
   $tog.change(slide);
}); //End $DOC.ready

function gPanelButtonPressedAction() {
    var pagelink='menu/'+$(this).attr('id')+'.html';
    $('.game_card').queue(function(){
      $('.game_card iframe').attr("src", pagelink);
      $(this).addClass('slid');
      $(this).delay(GAMECARD_SLIDE_DELAY);
      $(this).dequeue();
   });
    console.log('\t---ln: 39 from '+this+'---');
    console.log($('.game_card'));
}
function gPanelButtonBlurAction() {
    $('.game_card').queue(function(){
      $(this).removeClass('slid');
      $(this).delay(GAMECARD_SLIDE_DELAY);
      $(this).dequeue();
   });
    console.log('\t---ln: 329 from '+this+'---');
    console.log($('.game_card'));
}

function disable(jQueryObj) {
   return jQueryObj.attr('disabled', 'true');
}

function enable(jQueryObj) {
   return jQueryObj.removeAttr('disabled');
}

function titleObject(str) {
   this.origString = str;
   this.origTokens = str.match(/\S+/g); //original chars/punct
   this.normTokens =
      diacritics2url.replaceDiacritics(str.toLowerCase().replace(STD_PUNCT, ''))
      .match(/\S+/g);
   this.guessed = zeroArray(this.origTokens.length);
}

function slide() {
   var $this = $(this);
   if (!$this.prop('checked')) {
      $('.sliding').css({
         "transform": "translate(0,0)"
      });
      $('.toggleLabelIcon').css({
         "transform": "rotate(0deg)"
      });
   } else {
      $('.sliding').css({
         "transform": "translate(0,-" + $('.menu').height() + "px)"
      });
      $('.toggleLabelIcon').css({
         "transform": "rotate(180deg)"
      });
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
      This is condensed to the lines below: */
      var pageInfo = data.query.pages[Object.keys(data.query.pages)[0].toString()];

      console.log(pageInfo.fullurl);
      console.log(pageInfo.images);
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
         console.log('\t---ln: 111 from ' + this + '---');
         console.log(keys[i]);
         //put image objects in new array
         if (keys[i] > 0) { //missing images have ids of -1; don't include
            var current = data.query.pages[keys[i].toString()];
            images.push(current);
         }
      }
      return images;
   });
}

function addImagesToDocument(images, _) { //argument _ is extra passed in from $.when().done() 
   var $wrap = $('.wrap');
   for (var i = 0; i < NUM_INITIAL_IMAGES && images.length !== 0; i++) {
      var randIndex = Math.floor(Math.random() * images.length);
      console.log('\t---ln: 120 from ' + this + '---');
      console.log(images);
      console.log("var i = " + i);
      console.log(randIndex);
      console.log(images[randIndex]);
      console.log(images[randIndex].imageinfo);
      console.log('=============== Done');
      var nextImageInfo = images[randIndex].imageinfo[0];

      images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down 1

      var wrappedImage = getNewImageHtml(nextImageInfo, i);

      // var numImgs=$wrap.find('.pageImage').length;
      // console.log(numImgs);

      // if(numImgs%2===0)
      // {
      //    $wrap.append('<div class="row"></div>');
      // }
      // $($wrap.children().last()).append(wrappedImage);
      $wrap.append(wrappedImage);
      console.log('\t---ln: 142 from ' + this + '---');
      console.log(wrappedImage[0]);
      $(wrappedImage.find('img')[0]).unveil(0, removeLoaderClass());
   }
}

function removeLoaderClass() {
   $(this).removeClass('loader');
}
//TODO: FOR DESKTOP VERSION
// /*getNewImageHtml returns a new jQ node representing the input image
// wrapped in a page image wrapper*/
// function getNewImageHtml(nextImageInfo, i) {
//    var ret = $('<div class="box floatyWrapper unloaded"></div>').hide(),
//       imgTag = $('<img class="pageImage" id="img' + i + '" />)').attr('src', nextImageInfo.url).css({opacity: 0});

//    ret.ready(function() {
//       ret.append(imgTag);
//       ret.fadeIn('slow');
//    });

//    ret.waitForImages(function() {
//       imgTag.fadeTo('slow', 1);
//       ret.removeClass('unloaded');
//    });

//    return ret;
// }

/*getNewImageHtml returns a new jQ node representing the input image
wrapped in a page image wrapper*/
function getNewImageHtml(nextImageInfo, i) {
   var ret = $('<div class="box_wrapper floatyWrapper row"></div>'),
      unveilImgTag = $('<img class="pageImage loader u-max-full-width" id="img' + i + '" src="res/subtle_loader.gif"/>');

   /*
   TODO: make media delivery responsive/make sense (this isn't quite it)
   if (nextImageInfo.size > 600000) {
      unveilImgTag.attr('data-src', nextImageInfo.thumburl);
      console.log('thumb');
   } else {*/
   console.log('reg!');
   unveilImgTag.attr('data-src', nextImageInfo.url);
   // }

   console.log(nextImageInfo.size);

   // ret.ready(function() {
   //    ret.append(imgTag);
   //    ret.fadeIn('slow');
   // });

   // ret.waitForImages(function() {
   //    imgTag.fadeTo('slow', 1);
   //    ret.removeClass('unloaded');
   // });

   return ret.append(unveilImgTag);
}

/*focusedAction fires when text input gains focus.
If the default message was present, it is cleared.
The text color is set to its normal value (as opposed to the 
greyed-out color of the default message).
*/
function focusedAction() {
   var $this = $(this),
      $tog = $('.toggle');
   /*NOTE: hard coded color value of focused textbox text*/
   $this.css('color', '#262b26');
   if ($this.val() === DEFAULT_INPUT_MESSAGE)
      $this.val('');

   if (!$tog.prop('checked')) {
      wasChecked = false;
      $tog.prop('checked', true);
      $tog.change();
   }
}

/*keyupAction fires when a key is released while typing in text input.
Enables/disables submit button based on presence of text*/
function keyupAction() {
   if ($(this).val() !== '')
      enable($('.guessSubmit'));
   else
      disable($('.guessSubmit'));
}

/*blurAction fires when text input loses focus.
Enables/disables submit button in the same way as keyupAction.
If input is empty, replaces the default message text and styling*/
function blurAction() {
   var $this = $(this);
   if ($this.val() !== '')
      enable($('.guessSubmit'));
   else {
      $this.val(DEFAULT_INPUT_MESSAGE);
      $this.css('color', '#A6C090');
      disable($('.guessSubmit'));
   }
}

/*submitAction is called when a guess is submitted
Guess info is obtained by looking at the value of the textbox.
Updates to guess history and known words are performed.
The menu is scrolled to put the new history entry into view.*/
function submitAction() {
   var $menu = $('.menu'),
      guess = new titleObject($('.textField').val()),
      title = $DOC.data('wikiPageTitle'),
      wasChecked = true,
      lim = $('.goodWords').height() + 10;

   if ($menu.scrollTop() > lim) {
      $menu.animate({ scrollTop: lim }, wasChecked ? 300 : 1, 'swing', updateMenu(guess, 600, 'slow'));
   } else {
      updateMenu(guess, 'slow', 'slow');
   }

   $('.textField').val('');
}

function insertableElementClickAction() {
   var $textField = $('.textField');
   console.log("BUHHHHHHHHH YO");
   $textField.val($textField.val() + ' ' + $(this).text());
}

/*updateMenu delegates the creation of new DOM nodes for the guess
and coordinates their addition to the document with respect to their 
elements' animation speeds*/
function updateMenu(guess, slideDuration, fadeDuration) {
   var newHtml = getNewMenuHtml(guess, $DOC.data('wikiPageTitle'));
   addNewGuessHistory(newHtml.hist, slideDuration, fadeDuration);
   addNewGoodWords(newHtml.words, fadeDuration);
}

/*getNewMenuHtml goes through the new guess word-by-word and creates
the DOM nodes that will display them. All words are explicitly added as
text nodes (to avoid xss), and correct words are wrapped in an extra <span>
for highlighting. Newly guessed correct words are also packaged into 
elements for the list of good words. Results returned in object containing
an sNode (single jQuery node with the new history entry) and a wNodeList 
(possibly empty array of jQuery selectableContainer-class nodes each 
representing a new good word)*/
function getNewMenuHtml(guess, title) {
   var sNode = $('<hr class="guessDivide"><div class="guessContainer"><div class="inner menuText"></div></div>'),
      inner = sNode.find('.inner'),
      wNodeList = [],
      s = '';

   for (var i = 0; i < guess.normTokens.length; i++) {
      for (var j = 0; j < title.normTokens.length; j++) {
         if (guess.normTokens[i] === title.normTokens[j]) {
            inner.append(document.createTextNode(s));
            s = '';
            inner.append($('<span class="goodWord"></span>').text(guess.origTokens[i] + ' '));
            if (title.guessed[j] === 0) {
               wNodeList.push(makeWordNode(title.origTokens[j]));
            }
            guess.guessed[i]++;
            title.guessed[j]++;
            break;
         } else if (j === title.normTokens.length - 1) { //no match & this is last time comparing this guess tok
            s = s + guess.origTokens[i] + ' ';
         }
      }
   }
   inner.append(document.createTextNode(s));
   return { 'words': wNodeList, 'hist': sNode };
}

/*addNewGuessHistory animates the new guess history entry element node
into the history list in the menu. New entry fades in over fadeDuration
while older entries slide down over slideDuration*/
function addNewGuessHistory(histNode, slideDuration, fadeDuration) {
   $(histNode).hide().insertAfter('.guessHistory .menuHeadline').slideDown(
      slideDuration).fadeIn(fadeDuration);
}

/*addNewGoodWords iterates over the list of new good word nodes and fades 
each one into the document over a specified fadeDuration*/
function addNewGoodWords(wordNodeList, fadeDuration) {
   for (var i = wordNodeList.length - 1; i >= 0; i--) {
      $(wordNodeList[i]).hide().appendTo('.goodWords').fadeIn('fadeDuration');
   }
}

/*makeWordNode returns a "goodWord"-style jQ node with input text string*/
function makeWordNode(word) {
   var sock = $('<div class="selectableContainer"><span class="word menuText"></span></div>'),
      tmp = sock.find('.word')[0];
   $(tmp).text(word);
   $(tmp).click(insertableElementClickAction);
   return sock;
}

/*zeroArray returns a new zero-filled array of length l*/
function zeroArray(l) {
   var res = new Array(l);
   while (--l >= 0) {
      res[l] = 0;
   }
   return res;
}

/*isUnusableImage checks the title of an image against a collection of 
titles known to belong to junk images (found in UnusableImages.js).
Returns true if a match is identified.
Unusable (junk) images are parts of wikihow page templates that the server
returns alongside actual article images*/
function isUnusableImage(imageTitle) {
   if (UNUSABLE_IMAGES.includes(imageTitle)) {
      return true;
   }
   return false;
}

/*filterUnusableImages iterates through a list of images, calling
isUnusableImage on the title of each one. If an image is found to be 
unusable, it is removed from the array and discarded.
This method modifies the input directly and does not have a return value*/
function filterUnusableImages(imageArray) {
   if (imageArray != null) { // != is intentional, checks for undefined
      for (var i = imageArray.length - 1; i >= 0; i--) {
         if (isUnusableImage(imageArray[i].title))
            imageArray.splice(i, 1);
      }
   }
}

/*synthImageInfoQuery returns a url-encoded string written to query 
wikihow's mediawiki api for source information on the specific 
images contained in the input list. */
function synthImageInfoQuery(pageImages) {
   //base url to query api for image sources
   var queryUrl =
      'https://www.wikihow.com/api.php?action=query&format=json&prop=imageinfo&titles=';
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

// /*setFixedInputPosition calculates and sets the horizontal offset of the 
// floating input field so that it always remains above the page footer*/
// function setFixedInputPosition() {
//     if (window.innerWidth > 541)
//         $("#f_area").css("bottom", Math.max(0, ($DOC.scrollTop() + $(window).height()) -
//             $(".siteFooter").offset().top));
//     else
//         $("#f_area").css("bottom", 0);
// }
