var STD_PUNCT             = /[\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g,
    SEP_PUNCT             = /["(),<>?@\[\]_{}]/g,
    NUM_INITIAL_IMAGES    = 2,
    MIN_PAGE_IMAGES       = 4, //must be >= NUM_INITIAL_IMAGES
    DEFAULT_INPUT_MESSAGE = 'How to...',
    $DOC                  = $(document),
    promisedUsablePage    = asyncQueryForRandomUsablePage();
var gFirstScroll  = false,
    gDiff         = 0,
    gMobileLayout = !isGridActive();

var styles2Nuke = [];

$.when( //coordinates page loading (a masterpiece)
    promisedUsablePage.then(asyncQueryForPageImages),
    $DOC.data('readyDeferred')
).done(addImagesToDocument);

$DOC.data('readyDeferred', $.Deferred()).ready(function () {
    var $textField = $('.textField'),
        $tog       = $('.toggle'),
        $gamepanel = $('.game.panel');

    $.when(promisedUsablePage).done(function (pageInfo) {
        $DOC.data('wikiPageTitle', new TitleObject(pageInfo.title));
        $DOC.data('wikiPageURL', pageInfo.fullurl);
        prepareOverlay(pageInfo);
        initializeCounters();
    });

    $DOC.data('readyDeferred').resolve();

    $DOC.data('fixedFloatWidth', $gamepanel.width());
    $DOC.data('fixedFloatLeft', $gamepanel.offset().left);

    $(window).scroll(scrollAction);
    $(window).resize(resizeAction);
    $DOC.resize(resizeAction);
    var $panel_buttons = $('.gb');
    // $panel_buttons.blur(gPanelButtonBlurAction);
    $panel_buttons.click(gPanelButtonPressedAction);

    $('#imagehint').click(addImageToDocument);
    $('#wordhint').click(giveWordHint);
    $('.card_overlay, button.card_close').click(closeCard);

    $textField.focus(focusedAction);
    $textField.keyup(keyupAction);
    $textField.blur(blurAction);
    $tog.change(slide);

    $('.close_link').click(closeOverlay);
    $('.about').click(function () {
        overlayAction('about');
    });
    $('.top_header').click(function () {
        overlayAction('win');
    });
    $('.card_giveup').click(function () {
        overlayAction('loss');
    });


}); //End $DOC.ready

function openCard() {
    nukeStyles();
    if (isGridActive()) {
        $('.menu_clip').addClass('slid');
    }
    $('.card').addClass('slid');
    $('.card_overlay').addClass('selected');
    $('.card_clip').addClass('higherZIndex');
}

function closeCard() {
    $('.card_overlay').removeClass('selected');
    $('.card_message').removeClass('selected');
    $('.card, .menu_clip').removeClass('slid');
    $('.card_clip').removeClass('higherZIndex');
}

function prepareOverlay(pageInfo) {
    $('.page_link').attr('href', pageInfo.fullurl).prepend('<span>How to ' + pageInfo.title + '</span>');
}

function isGridActive() {
    return ($('.trim').css('display') !== 'none');
}

function resizeAction() {
    var $gamepanel = $('.panel.game');

    gDiff = $DOC.scrollTop() + $(window).height() - ($DOC.height() - $('.page_footer').height());

    $DOC.data('fixedFloatWidth', $gamepanel.width());
    $DOC.data('fixedFloatLeft', $gamepanel.offset().left);
    scrollAction();
    if (isGridActive()) {
        if (gMobileLayout) {
            gMobileLayout = false;
            nukeStyles();
        }
    } else {
        if (!gMobileLayout) {
            gMobileLayout = true;
            nukeStyles();
        }
    }
}

function nukeStyles() {
    if (styles2Nuke.length === 0) {
        var $widgetheader = $('.widget_header');
        styles2Nuke.push(
            $('.history_log'),
            $('.menu_clip'),
            $('.sliding_up_mobile'),
            $widgetheader,
            $widgetheader.find('i'),
            $widgetheader.find('.band'),
            $('.guessSection'),
            $('.spacie')
        );
    }
    for (var i = styles2Nuke.length; i <= 0; i--) {
        styles2Nuke[i].removeAttr('style');
    }
    $('.answer').css('box-shadow', ''); //done separately to preserve custom 'bottom' prop
    $('.toggle').removeAttr('checked');
}

function scrollAction() {
    if ($(document.activeElement).hasClass('gb')) {
        $(document.activeElement).blur();
    }
    if (isGridActive()) {
        if (!gFirstScroll) {
            gFirstScroll = true;
            resizeAction();
            return;
        }
        var $gamepanel  = $('.game.panel'),
            $historyLog = $('.history_log'),
            $menuClip   = $('.menu_clip'),
            $answer     = $('.answer'),
            space       = $(window).scrollTop() - ($gamepanel.offset().top + $gamepanel.height());

        closeCard();
        gDiff = $(window).scrollTop() + $(window).height() - $('.page_footer').offset().top;

        if (gDiff > 0) {
            $answer.add($menuClip).css({bottom: gDiff});
        } else {
            $answer.add($menuClip).css({bottom: 0});
        }
        if (space > 0) {
            $('.spacie').css({
                position: 'relative'
            });
            $historyLog.css({
                "max-height": $answer[0].getBoundingClientRect().top - $historyLog[0].getBoundingClientRect().top - 30
            });
            $menuClip.css({
                position: 'fixed',
                width: $DOC.data('fixedFloatWidth'),
                top: 20,
                left: $DOC.data('fixedFloatLeft')
            });
            $menuClip.find('.panel').css({
                'box-shadow': '0 0 8px rgba(0, 0, 0, 0.16)'
            });
        } else {
            $menuClip.css({
                position: '',
                width: '',
                top: '',
                left: '',
                'box-shadow': ''
            });
            $menuClip.find('.panel').css({
                'box-shadow': ''
            });
            $('.spacie').css({
                position: 'absolute',
                height: $menuClip.outerHeight(true)
            });
        }
    }
}

function gPanelButtonPressedAction() {
    $('.card_message').removeClass('selected');
    openCard();
    var $this = $(this);
    if ($this.attr('id') === 'giveup') {
        $('.giveup_confirmation').addClass('selected');
    } else if ($this.attr('id') === 'restart') {
        $('.restart_confirmation').addClass('selected');
    } else if ($this.attr('id') === 'share') {
        $('.sharingsux').addClass('selected');
    }
}

function disable(jQueryObj) {
    return jQueryObj.attr('disabled', 'true');
}

function enable(jQueryObj) {
    return jQueryObj.removeAttr('disabled');
}

function TitleObject(str) {
    this.origString = str;
    this.origTokens = str.match(/\S+/g); //original chars/punct
    this.normTokens =
        diacritics2url.replaceDiacritics(str.toLowerCase().replace(STD_PUNCT, ''))
            .match(/\S+/g);
    this.wordTokens = str.replace(SEP_PUNCT, '').match(/\S+/g);
    this.guessed = zeroArray(this.origTokens.length);
}

function slide() {
    var $this                        = $(this),
        $widgetHeader                = $('.widget_header'),
        $widgetHeaderAndGuessSection = $widgetHeader.add('.guessSection'),
        $answer                      = $('.answer'),
        $menuClip                    = $('.menu_clip'),
        $topHeader                   = $('.top_header'),
        $widgetHeaderAndI            = $widgetHeader.find('i'),
        $widgetHeaderAndBand         = $widgetHeader.find('.band'),
        $slidingUpMobile             = $('.sliding_up_mobile');

    $slidingUpMobile.css({
        "transform": "translate(0,0)"
    });
    if (!$this.prop('checked')) {
        $slidingUpMobile.animate({
            "transform": "translate(0,0)"
        }, 500, 'swing', function () {
            $widgetHeaderAndGuessSection.css({
                'box-shadow': 'none'
            });
            $answer.css({
                'box-shadow': '0 0 10px rgba(0, 0, 0, 0.16)'
            });
            $menuClip.add($topHeader).removeAttr('style');
        });

        $widgetHeaderAndI.css({
            "transform": "rotate(0deg)"
        });
        $widgetHeaderAndBand.css({
            'border-bottom': '.5px solid #8a8a89'
        });

    } else {
        closeCard();
        $menuClip.css({
            "z-index": 1
        });
        $topHeader.css({
            "z-index": 1
        });
        $slidingUpMobile.css({
            "transform": "translate(0,-" + $('.menu').height() + "px)"
        });
        $widgetHeaderAndI.css({
            "transform": "rotate(180deg)"
        });
        $widgetHeaderAndBand.css({
            'border-bottom': 'none'
        });
        $widgetHeaderAndGuessSection.css({
            'box-shadow': '0 0 10px rgba(0, 0, 0, 0.16)'
        });
        $answer.css({
            'box-shadow': 'none'
        });
    }
}

function openOverlay() {
    $('.overlay').height('100%');
}

function closeOverlay() {
    $('.overlay').height('0');
}

function asyncQueryForRandomUsablePage() {
    /* request random article and see if it has enough usable images*/
    return $.ajax({ //get random page using mediawiki API
        url: 'https://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&generator=random&inprop=url&imlimit=100&grnnamespace=0#',
        dataType: 'jsonp'
    }).then(function (data) {
        /*The mediawiki api answers our request with a complex json object structure.
         However, all of the data we're interested in is kept in a sub-object, "pageInfo"
         Accessing it requires making this series of calls:
         var page = jsonpData.query.pages;
         var pageId = Object.keys(page)[0];
         var pageInfo = page[pageId.toString()];
         This is condensed to the lines below: */
        var pageInfo = data.query.pages[Object.keys(data.query.pages)[0].toString()];
        console.log(pageInfo);
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
    }).then(function (data) {
        //create array and fill w/ slightly more accessable image data
        var images = [];
        var keys = Object.keys(data.query.pages);

        for (var i = 0; i < keys.length; i++) {
            //put image objects in new array
            if (keys[i] > 0) { //missing images have ids of -1; don't include
                var current = data.query.pages[keys[i].toString()];
                images.push(current);
            }
        }
        return images;
    });
}

function addImageToDocument() {
    var images = $DOC.data('undisplayedImages');
    if (images.length !== 0) {
        var $wrap = $('.wrap');
        var randIndex = Math.floor(Math.random() * images.length);
        var nextImageInfo = images[randIndex].imageinfo[0];

        images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down 1

        var wrappedImage = getNewImageHtml(nextImageInfo);
        $wrap.append(wrappedImage);
        incrementCounter('numImageHints');

        $(wrappedImage.find('img')[0]).unveil(0, function () {
            $(this).load(function () {
                scrollAction();
            })
        });
        if (images.length < 1) {
            disable($(this)); //disable button calling this as a listener funct.
        }
    } else {
        disable($(this));
    }

}

function giveWordHint() {
    console.log("lol");
    var title = $DOC.data('wikiPageTitle');
    var tmp = [];
    for (var i = title.normTokens.length - 1; i >= 0; i--) {
        if (title.guessed[i] === 0) {
            tmp.push(i);
        }
    }
    if (tmp.length >= 1) {
        var n = Math.floor(Math.random() * tmp.length);
        title.guessed[tmp[n]]++;
        incrementCounter('numWordHints');

        addNewGoodWords(makeWordNode(title.wordTokens[tmp[n]]), 'slow');
        if (tmp.length === 1) {
            disable($(this)); //disable button calling this as a listener funct.
        }
    } else {
        disable($(this)); //disable button calling this as a listener funct.
    }
}

function addImagesToDocument(images, _) { //argument _ is extra passed in from $.when().done()
    var $wrap = $('.wrap');
    $DOC.data('undisplayedImages', images);
    for (var i = 0; i < NUM_INITIAL_IMAGES && images.length !== 0; i++) {
        var randIndex     = Math.floor(Math.random() * images.length),
            nextImageInfo = images[randIndex].imageinfo[0];
        images.splice(randIndex, 1); //removes used image from array and shifts all subsequent indexes down 1

        var wrappedImage = getNewImageHtml(nextImageInfo);
        $wrap.append(wrappedImage);
        $(wrappedImage.find('img')[0]).unveil(0, function () {
            $(this).load(function () {
                scrollAction();
            })
        });
    }
}

function updateAfterImageAdded() {
    $(this).removeClass('loader');
    scrollAction();
}

/*getNewImageHtml returns a new jQ node representing the input image
 wrapped in a page image wrapper*/
function getNewImageHtml(nextImageInfo) {
    var ret          = $('<div class="box_wrapper floatyWrapper row"></div>'),
        unveilImgTag = $('<img class="pageImage loader u-max-full-width" src="http://i.imgur.com/WYp19wj.gif"/>');

    ret.resize(function () {
        console.log("HEYYYY");
        resizeAction();
    });
    // TODO: make media delivery responsive/make sense (this isn't quite it)
    if (!isGridActive()) {
        unveilImgTag.attr('data-src', nextImageInfo.thumburl);
        console.log('thumb');
    } else {
        unveilImgTag.attr('data-src', nextImageInfo.url);
    }
    return ret.append(unveilImgTag);
}

/*focusedAction fires when text input gains focus.
 If the default message was present, it is cleared.
 The text color is set to its normal value (as opposed to the
 greyed-out color of the default message).
 */
function focusedAction() {
    var $this = $(this);

    /*NOTE: hard coded color value of focused textbox text*/
    $this.css({color: '#222', 'font-style': 'normal'});
    if ($this.val() === DEFAULT_INPUT_MESSAGE) {
        $this.val('');
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
        $this.css({color: '#8a8a89', 'font-style': 'italic'});
        disable($('.guessSubmit'));
    }
}

/*submitAction is called when a guess is submitted
 Guess info is obtained by looking at the value of the textbox.
 Updates to guess history and known words are performed.
 The menu is scrolled to put the new history entry into view.*/
function submitAction() {
    var $menu = $('.menu'),
        str   = $('.textField').val(),
        guess = new TitleObject(str.replace(/^\s*how\s+to\s+/gi, '')),
        title = $DOC.data('wikiPageTitle');

    if (isGridActive()) {
        if (updateMenu(guess, 'slow', 'slow')) {
            overlayAction('win');
        }
    } else {
        if (updateMenuMobile(guess, 'slow', 'slow')) {
            overlayAction('win');
        }
    }
    $('.textField').val('');
}

function overlayAction(type) {
    makeOverlay(type);
    openOverlay();
}

function makeOverlay(type) {
    $('.overlay_info').hide();
    $('.overlay_info_wrapper').removeClass('contains_attribs');
    $('.overlay_info_wrapper').removeClass('contains_win_screen');
    switch (type) {
        case 'win':
            $('.win_screen').show();
            $('.score').show();
            $('.overlay_info_wrapper').addClass('contains_win_screen');
            $('.win_screen h2').text('Yep!');
            $('.win_screen h2 + h6').html('<i>Of course</i> we\'re learning');
            break;
        case 'loss':
            $('.overlay_info_wrapper').addClass('contains_win_screen');
            $('.win_screen').show();
            $('.score').hide();
            $('.win_screen h2').text('¯\\_(ツ)_/¯');
            $('.win_screen h2 + h6').html('We were clearly going for');
            break;
        case 'about':
            $('.overlay_info_wrapper').addClass('contains_attribs');
            $('.attribs').show();
            break;
    }
}

function initializeCounters() {
    $('.counter').data('num', 0);
    $('#numImageHints').data('num', NUM_INITIAL_IMAGES);

    $('#numImageHints').data('labelInfo', ['image', 'images']);
    $('#numWordHints').data('labelInfo', ['hint', 'hints']);
    $('.numGuesses').data('labelInfo', ['try', 'tries']);
    $('#numWords').data('outof', $DOC.data('wikiPageTitle').normTokens.length);

    $('.counter').text('0');
    $('#numImageHints').text(NUM_INITIAL_IMAGES);
    $('#numWords').text('(0/' + $('#numWords').data('outof') + ')');
}

function incrementCounter(counterID) {
    var $counter = counterID === 'numGuesses' ? $('.' + counterID) : $('#' + counterID),
        oldnum   = $counter.data('num');

    $counter.data('num', oldnum + 1);
    $counter.text(oldnum + 1);

    if (counterID === 'numWords') {
        var outof = $counter.data('outof');
        if (oldnum + 1 !== 0) {
            $('.empty_message').remove();
        }
        $counter.text('(' + (oldnum + 1) + '/' + outof + ')');
    }

    var labelInfo = $counter.data('labelInfo');
    if (labelInfo) {
        var $label = $('#' + counterID + '_label');
        if (oldnum + 1 === 1) {
            $label.text(labelInfo[0]);
        } else if (oldnum + 1 === 2) {
            $label.text(labelInfo[1]);
        }
    }
}

function insertableElementClickAction() {
    var $textField = $('.textField');

    $textField.focus();
    if ($textField.val() === '') {
        $textField.val($(this).text().trim());
    } else {
        $textField.val($textField.val() + ' ' + $(this).text().trim());
    }
}

/*updateMenu delegates the creation of new DOM nodes for the guess
 and coordinates their addition to the document with respect to their
 elements' animation speeds*/
function updateMenu(guess, slideDuration, fadeDuration) {
    var newHtml = getNewMenuHtml(guess, $DOC.data('wikiPageTitle'));
    addNewGoodWords(newHtml.words, fadeDuration);
    addNewGuessHistory(newHtml.hist, slideDuration, fadeDuration);
    return newHtml.win;
}

function updateMenuMobile(guess, slideDuration, fadeDuration) {
    if (!$('.toggle').prop('checked'))
        $('.toggle').trigger('click');
    return updateMenu(guess, slideDuration, fadeDuration);
}

/*getNewMenuHtml goes through the new guess word-by-word and creates
 the DOM nodes that will display them. All words are explicitly added as
 text nodes (to avoid xss), and correct words are wrapped in an extra <span>
 for highlighting. Newly guessed correct words are also packaged into
 elements for the list of good words. Results returned in object containing
 an sNode (single jQuery node with the new history entry) and a wNodeList
 (possibly empty array of jQuery selectable_container-class nodes each
 representing a new good word)*/
function getNewMenuHtml(guess, title) {
    var sNode     = $('<div class="guess_container"><div class="inner menuText"></div></div><hr>'),
        inner     = sNode.find('.inner'),
        wNodeList = [],
        s         = '',
        win       = (guess.normTokens.length === title.normTokens.length);

    for (var i = 0; i < guess.normTokens.length; i++) {
        for (var j = 0; j < title.normTokens.length; j++) {
            if (i === j && guess.normTokens[i] !== title.normTokens[j]) {
                win = false;
            }
            if (guess.normTokens[i] === title.normTokens[j]) {
                inner.append(document.createTextNode(s));
                s = '';
                var gw = $('<em></em>').text(guess.origTokens[i].trim() + ' ');
                gw.click(insertableElementClickAction);
                inner.append(gw);
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
    return {'words': wNodeList.reverse(), 'hist': sNode, 'win': win};
}

/*addNewGuessHistory animates the new guess history entry element node
 into the history list in the menu. New entry fades in over fadeDuration
 while older entries slide down over slideDuration*/
function addNewGuessHistory(histNode, slideDuration, fadeDuration) {
    incrementCounter('numGuesses');
    $(histNode).hide().prependTo('.history_log').slideDown(
        slideDuration).fadeIn(fadeDuration);
}

/*addNewGoodWords iterates over the list of new good word nodes and fades
 each one into the document over a specified fadeDuration*/
function addNewGoodWords(wordNodeList, fadeDuration) {

    for (var i = wordNodeList.length - 1; i >= 0; i--) {
        $(wordNodeList[i]).hide().appendTo('.good_words').fadeIn('fadeDuration');
        incrementCounter('numWords');
    }
}

/*makeWordNode returns a "good_word"-style jQ node with input text string*/
function makeWordNode(word) {
    var sock = $('<div class="selectable_container"><span class="word menuText"></span></div>'),
        tmp  = sock.find('.word')[0];
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
    for (var i = UNUSABLE_IMAGES.length - 1; i >= 0; i--) {
        if (UNUSABLE_IMAGES[i] === imageTitle) {
            return true;
        }
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
