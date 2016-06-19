function getPageParameter(){for(var e=window.location.search.substring(1).split("&"),t=0,a=e.length;a>t;t++){var s=e[t].split("=");if("p"===s[0])return s[1]}}function copyURL(){if($(this).hasClass("end_screen"))var e=$(".url_text.end_screen");else var e=$(".url_text.share_screen");e.focus(),e.select(),document.execCommand("copy"),$(".copy_tooltip_text").text("Copied!")}function pageFoundAction(e){$DOC.data("wikiPageTitle",new TitleObject(e.title)),$DOC.data("wikiPageId",e.pageid),$DOC.data("wikiPageURL",e.fullurl);var t=encodeURI(window.location.protocol+"//"+window.location.host+window.location.pathname+"?p="+e.pageid);$(".url_text").val(t),prepareOverlay(e),initializeCounters()}function openCard(){nukeStyles(),isGridActive()&&$(".menu_clip").addClass("slid"),$(".card").addClass("slid"),$(".card_overlay").addClass("selected"),$(".card_clip").addClass("higherZIndex")}function closeCard(){$(".card_overlay").removeClass("selected"),setTimeout(function(){$(".card_message").removeClass("selected")},400),$(".card, .menu_clip").removeClass("slid"),$(".card_clip").removeClass("higherZIndex")}function prepareOverlay(e){$(".page_link").attr("href",e.fullurl).prepend("<span>How to "+e.title+"</span>")}function isGridActive(){return"none"!==$(".trim").css("display")}function resizeAction(){var e=$(".panel.game");gDiff=$DOC.scrollTop()+$(window).height()-($DOC.height()-$(".page_footer").height()),$DOC.data("fixedFloatWidth",e.width()),$DOC.data("fixedFloatLeft",e.offset().left),scrollAction(),isGridActive()?gMobileLayout&&(gMobileLayout=!1,nukeStyles()):gMobileLayout||(gMobileLayout=!0,nukeStyles())}function nukeStyles(){if(0===styles2Nuke.length){var e=$(".widget_header");styles2Nuke.push($(".history_log"),$(".menu_clip"),$(".sliding_up_mobile"),e,e.find("i"),e.find(".band"),$(".guessSection"),$(".spacie"))}for(var t=styles2Nuke.length;0>=t;t--)styles2Nuke[t].removeAttr("style");$(".answer").css("box-shadow",""),$(".toggle").removeAttr("checked")}function scrollAction(){if($(document.activeElement).hasClass("gb")&&$(document.activeElement).blur(),isGridActive()){if(!gFirstScroll)return gFirstScroll=!0,void resizeAction();var e=$(".game.panel"),t=$(".history_log"),a=$(".menu_clip"),s=$(".answer"),n=$(window).scrollTop()-(e.offset().top+e.height());closeCard(),gDiff=$(window).scrollTop()+$(window).height()-$(".page_footer").offset().top,gDiff>0?s.add(a).css({bottom:gDiff}):s.add(a).css({bottom:0}),n>0?($(".spacie").css({position:"relative"}),t.css({"max-height":s[0].getBoundingClientRect().top-t[0].getBoundingClientRect().top-30}),a.css({position:"fixed",width:$DOC.data("fixedFloatWidth"),top:20,left:$DOC.data("fixedFloatLeft")}),a.find(".panel").css({"box-shadow":"0 0 8px rgba(0, 0, 0, 0.16)"})):(a.css({position:"",width:"",top:"",left:"","box-shadow":""}),a.find(".panel").css({"box-shadow":""}),$(".spacie").css({position:"absolute",height:a.outerHeight(!0)}))}}function gPanelButtonPressedAction(){$(".card_message").removeClass("selected");var e=$(this);return"rules"===e.attr("id")?void overlayAction("rules"):("giveup"===e.attr("id")?$(".giveup_confirmation").addClass("selected"):"restart"===e.attr("id")?$(".restart_confirmation").addClass("selected"):"share"===e.attr("id")&&$(".sharingsux").addClass("selected"),void openCard())}function disable(e){return e.attr("disabled","true")}function enable(e){return e.removeAttr("disabled")}function TitleObject(e){this.origString=e,this.origTokens=e.match(/\S+/g),this.normTokens=diacritics2url.replaceDiacritics(e.toLowerCase().replace(STD_PUNCT,"")).match(/\S+/g),this.wordTokens=e.replace(SEP_PUNCT,"").match(/\S+/g),this.guessed=zeroArray(this.origTokens.length)}function slide(){var e=$(this),t=$(".widget_header"),a=t.add(".guessSection"),s=$(".answer"),n=$(".menu_clip"),r=$(".top_header"),i=t.find("i"),o=t.find(".band"),l=$(".sliding_up_mobile");l.css({transform:"translate(0,0)"}),e.prop("checked")?(closeCard(),n.css({"z-index":1}),r.css({"z-index":1}),l.css({transform:"translate(0,-"+$(".menu").height()+"px)"}),i.css({transform:"rotate(180deg)"}),o.css({"border-bottom":"none"}),a.css({"box-shadow":"0 0 10px rgba(0, 0, 0, 0.16)"}),s.css({"box-shadow":"none"})):(l.animate({transform:"translate(0,0)"},500,"swing",function(){a.css({"box-shadow":"none"}),s.css({"box-shadow":"0 0 10px rgba(0, 0, 0, 0.16)"}),n.add(r).removeAttr("style")}),i.css({transform:"rotate(0deg)"}),o.css({"border-bottom":".5px solid #8a8a89"}))}function openOverlay(){$(".overlay").height("100%")}function closeOverlay(){$(".overlay").height("0")}function asyncQueryForRandomUsablePage(e){var t,e=e||null;return t=null!=e?"https://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&pageids="+e+"&inprop=url&imlimit=100":"https://www.wikihow.com/api.php?action=query&format=json&prop=info%7Cimages&generator=random&inprop=url&imlimit=100&grnnamespace=0#",$.ajax({url:t,dataType:"jsonp"}).then(function(e){var t=e.query.pages[Object.keys(e.query.pages)[0].toString()];return filterUnusableImages(t.images),null==t.images||t.images.length<MIN_PAGE_IMAGES||t.title.length>256?asyncQueryForRandomUsablePage():t})}function asyncQueryForPageImages(e){return $.ajax({url:synthImageInfoQuery(e.images),dataType:"jsonp"}).then(function(e){for(var t=[],a=Object.keys(e.query.pages),s=0;s<a.length;s++)if(a[s]>0){var n=e.query.pages[a[s].toString()];t.push(n)}return t})}function addImageToDocument(){var e=$DOC.data("undisplayedImages");if(0!==e.length){var t=$(".wrap"),a=Math.floor(Math.random()*e.length),s=e[a].imageinfo[0];e.splice(a,1);var n=getNewImageHtml(s);t.append(n),incrementCounter("numImageHints"),$(n.find("img")[0]).unveil(0,function(){$(this).load(function(){scrollAction()})}),e.length<1&&disable($(this))}else disable($(this))}function giveWordHint(){for(var e=$DOC.data("wikiPageTitle"),t=[],a=e.normTokens.length-1;a>=0;a--)0===e.guessed[a]&&t.push(a);if(t.length>=1){var s=Math.floor(Math.random()*t.length);e.guessed[t[s]]++,incrementCounter("numWordHints"),addNewGoodWords(makeWordNode(e.wordTokens[t[s]]),"slow"),1===t.length&&disable($(this))}else disable($(this))}function addImagesToDocument(e,t){var a=$(".wrap");$DOC.data("undisplayedImages",e);for(var s=0;NUM_INITIAL_IMAGES>s&&0!==e.length;s++){var n=Math.floor(Math.random()*e.length),r=e[n].imageinfo[0];e.splice(n,1);var i=getNewImageHtml(r);a.append(i),$(i.find("img")[0]).unveil(0,function(){$(this).load(function(){scrollAction()})})}}function getNewImageHtml(e){var t=$('<div class="box_wrapper floatyWrapper row"></div>'),a=$('<img class="pageImage u-max-full-width" src="/images/ring.gif"/>');return t.resize(function(){resizeAction()}),a.attr("data-src",e.url),t.append(a)}function focusedAction(){var e=$(this);e.css({color:"#222","font-style":"normal"}),e.val()===DEFAULT_INPUT_MESSAGE&&e.val("")}function keyupAction(){""!==$(this).val()?enable($(".guessSubmit")):disable($(".guessSubmit"))}function blurAction(){var e=$(this);""!==e.val()?enable($(".guessSubmit")):(e.val(DEFAULT_INPUT_MESSAGE),e.css({color:"#8a8a89","font-style":"italic"}),disable($(".guessSubmit")))}function submitAction(){var e=($(".menu"),$(".textField").val()),t=new TitleObject(e.replace(/^\s*how\s+to\s+/gi,""));$DOC.data("wikiPageTitle");isGridActive()?updateMenu(t,"slow","slow")&&overlayAction("win"):updateMenuMobile(t,"slow","slow")&&overlayAction("win"),$(".textField").val("")}function overlayAction(e){makeOverlay(e),openOverlay()}function makeOverlay(e){var t=$(".overlay_info_wrapper"),a=t.find(".overlay_info"),s=$(".win_screen");switch(a.hide(),t.removeClass("contains_attribs").removeClass("contains_win_screen").removeClass("contains_rules_screen"),e){case"win":$(".score").show(),t.addClass("contains_win_screen"),s.show().find("h2").text("Yep!"),s.find("h2 + h6").html("<i>Of course</i> we're learning");var n=$(".contains_win_screen");n.css({top:($(window).height()-n.outerHeight(!0))/2});break;case"loss":$(".score").hide(),t.addClass("contains_win_screen"),s.show().find("h2").text("¯\\_(ツ)_/¯"),s.find("h2 + h6").html("We were clearly going for");var n=$(".contains_win_screen");n.css({top:($(window).height()-n.outerHeight(!0))/2});break;case"about":t.addClass("contains_attribs").css({top:($(window).height()-$(".contains_attribs").outerHeight(!0))/2}),$(".attribs").show();break;case"rules":t.addClass("contains_rules_screen").css({top:($(window).height()-$(".contains_rules_screen").outerHeight(!0))/2}),$(".rules_screen").show()}}function initializeCounters(){$(".counter").data("num",0),$("#numImageHints").data("num",NUM_INITIAL_IMAGES),$("#numImageHints").data("labelInfo",["image","images"]),$("#numWordHints").data("labelInfo",["hint","hints"]),$(".numGuesses").data("labelInfo",["try","tries"]),$("#numWords").data("outof",$DOC.data("wikiPageTitle").normTokens.length),$(".counter").text("0"),$("#numImageHints").text(NUM_INITIAL_IMAGES),$("#numWords").text("(0/"+$("#numWords").data("outof")+")")}function incrementCounter(e){var t="numGuesses"===e?$("."+e):$("#"+e),a=t.data("num");if(t.data("num",a+1),t.text(a+1),"numWords"===e){var s=t.data("outof");a+1!==0&&$(".empty_message").remove(),t.text("("+(a+1)+"/"+s+")")}var n=t.data("labelInfo");if(n){var r=$("#"+e+"_label");a+1===1?r.text(n[0]):a+1===2&&r.text(n[1])}}function insertableElementClickAction(){var e=$(".textField");e.focus(),""===e.val()?e.val($(this).text().trim()):e.val(e.val()+" "+$(this).text().trim())}function updateMenu(e,t,a){var s=getNewMenuHtml(e,$DOC.data("wikiPageTitle"));return addNewGoodWords(s.words,a),addNewGuessHistory(s.hist,t,a),s.win}function updateMenuMobile(e,t,a){return $(".toggle").prop("checked")||$(".toggle").trigger("click"),updateMenu(e,t,a)}function getNewMenuHtml(e,t){for(var a=$('<div class="guess_container"><div class="inner menuText"></div></div><hr>'),s=a.find(".inner"),n=[],r="",i=e.normTokens.length===t.normTokens.length,o=0;o<e.normTokens.length;o++)for(var l=0;l<t.normTokens.length;l++){if(o===l&&e.normTokens[o]!==t.normTokens[l]&&(i=!1),e.normTokens[o]===t.normTokens[l]){s.append(document.createTextNode(r)),r="";var g=$("<em></em>").text(e.origTokens[o].trim()+" ");g.click(insertableElementClickAction),s.append(g),0===t.guessed[l]&&n.push(makeWordNode(t.origTokens[l])),e.guessed[o]++,t.guessed[l]++;break}l===t.normTokens.length-1&&(r=r+e.origTokens[o]+" ")}return s.append(document.createTextNode(r)),{words:n.reverse(),hist:a,win:i}}function addNewGuessHistory(e,t,a){incrementCounter("numGuesses"),$(".empty_message_hist").remove(),$(e).hide().prependTo(".history_log").slideDown(t).fadeIn(a)}function addNewGoodWords(e,t){for(var a=e.length-1;a>=0;a--)$(e[a]).hide().appendTo(".good_words").fadeIn("fadeDuration"),incrementCounter("numWords")}function makeWordNode(e){var t=$('<div class="selectable_container"><span class="word menuText"></span></div>'),a=t.find(".word")[0];return $(a).text(e),$(a).click(insertableElementClickAction),t}function zeroArray(e){for(var t=new Array(e);--e>=0;)t[e]=0;return t}function isUnusableImage(e){for(var t=UNUSABLE_IMAGES.length-1;t>=0;t--)if(UNUSABLE_IMAGES[t]===e)return!0;return!1}function filterUnusableImages(e){if(null!=e)for(var t=e.length-1;t>=0;t--)isUnusableImage(e[t].title)&&e.splice(t,1)}function synthImageInfoQuery(e){for(var t="https://www.wikihow.com/api.php?action=query&format=json&prop=imageinfo&titles=",a=0;a<e.length;a++)t+=e[a].title,t+=a<e.length-1?"%7C":"&iiprop=url%7Csize&iiurlwidth=500";return t=t.replace(/ /g,"+")}!function(e){function t(e){return e.replace(/[^\u0000-\u0020\u0041-\u00A0\u0030-\u0039]/g,function(e){return n[e.charCodeAt(0)]||e})}function a(e){return e=t(e),e=e.toLocaleLowerCase(),e=e.replace(/[^a-z0-9]/g,"-"),e=e.replace(/\-{2,}/g,"-"),e=e.replace(/^-|-$/g,""),escape(e)}for(var s=[{base:"A",letters:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",letters:"Ꜳ"},{base:"AE",letters:"ÆǼǢｮ"},{base:"Ae",letters:"Ä"},{base:"AO",letters:"Ꜵ"},{base:"AU",letters:"Ꜷ"},{base:"AV",letters:"ꜸꜺ"},{base:"AY",letters:"Ꜽ"},{base:"a",letters:"ªaⓐａẚàáâầấẫẩãāăằắẵẳȧǡǟảåǻǎȁȃạậặḁąⱥɐ"},{base:"aa",letters:"ꜳ"},{base:"ae",letters:"æǽǣä"},{base:"ao",letters:"ꜵ"},{base:"at",letters:"@＠"},{base:"au",letters:"ꜷ"},{base:"av",letters:"ꜹꜻ"},{base:"ay",letters:"ꜽ"},{base:"B",letters:"BⒷＢḂḄḆɃƂƁ"},{base:"b",letters:"bⓑｂḃḅḇƀƃɓ"},{base:"C",letters:"©CⒸＣĆĈĊČÇḈƇȻꜾｩ"},{base:"c",letters:"cⓒｃćĉċčçḉƈȼꜿↄ"},{base:"D",letters:"ÐDⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"},{base:"DZ",letters:"ǱǄ"},{base:"Dz",letters:"ǲǅ"},{base:"d",letters:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{base:"dz",letters:"ǳǆ"},{base:"E",letters:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{base:"e",letters:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{base:"F",letters:"FⒻＦḞƑꝻ"},{base:"f",letters:"fⓕｆḟƒꝼ"},{base:"G",letters:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{base:"g",letters:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{base:"H",letters:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"h",letters:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",letters:"ƕ"},{base:"I",letters:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"IJ",letters:"Ĳ"},{base:"i",letters:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"ij",letters:"ĳ"},{base:"J",letters:"JⒿＪĴɈ"},{base:"j",letters:"jⓙｊĵǰɉ"},{base:"K",letters:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"k",letters:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"L",letters:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",letters:"Ǉ"},{base:"Lj",letters:"ǈ"},{base:"l",letters:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{base:"lj",letters:"ǉ"},{base:"M",letters:"MⓂＭḾṀṂⱮƜ"},{base:"m",letters:"mⓜｍḿṁṃɱɯ"},{base:"N",letters:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{base:"NJ",letters:"Ǌ"},{base:"Nj",letters:"ǋ"},{base:"n",letters:"nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"},{base:"nj",letters:"ǌ"},{base:"O",letters:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"Oe",letters:"Ö"},{base:"OI",letters:"Ƣ"},{base:"OO",letters:"Ꝏ"},{base:"OU",letters:"Ȣ"},{base:"o",letters:"oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{base:"oe",letters:"ö"},{base:"oi",letters:"ƣ"},{base:"ou",letters:"ȣ"},{base:"oo",letters:"ꝏ"},{base:"P",letters:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"p",letters:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{base:"Q",letters:"QⓆＱꝖꝘɊ"},{base:"q",letters:"qⓠｑɋꝗꝙ"},{base:"R",letters:"®RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂｨ"},{base:"r",letters:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"S",letters:"SⓈＳŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"SS",letters:"ẞ"},{base:"s",letters:"sⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{base:"ss",letters:"ßｧ"},{base:"T",letters:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"TZ",letters:"Ꜩ"},{base:"TM",letters:"ｪ"},{base:"t",letters:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"tz",letters:"ꜩ"},{base:"U",letters:"UⓊＵÙÚÛŨṸŪṺŬǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"Ue",letters:"Ü"},{base:"u",letters:"uⓤｕùúûũṹūṻŭǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"ue",letters:"ü"},{base:"V",letters:"VⓋＶṼṾƲꝞɅ"},{base:"VY",letters:"Ꝡ"},{base:"v",letters:"vⓥｖṽṿʋꝟʌ"},{base:"vy",letters:"ꝡ"},{base:"W",letters:"WⓌＷẀẂŴẆẄẈⱲ"},{base:"w",letters:"wⓦｗẁẃŵẇẅẘẉⱳ"},{base:"X",letters:"XⓍＸẊẌ"},{base:"x",letters:"xⓧｘẋẍ"},{base:"Y",letters:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"y",letters:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"Z",letters:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"z",letters:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"},{base:"0",letters:"0０"},{base:"1",letters:"1¹１"},{base:"2",letters:"2²２"},{base:"3",letters:"3³３"},{base:"4",letters:"4４"},{base:"5",letters:"5５"},{base:"6",letters:"6６"},{base:"7",letters:"7７"},{base:"8",letters:"8８"},{base:"9",letters:"9９"}],n={},r=0;r<s.length;r++)for(var i=s[r].letters.split(""),o=0;o<i.length;o++)n[i[o].charCodeAt(0)]=s[r].base;e.diacritics2url=a,e.diacritics2url.replaceDiacritics=t}(window),function(e){e.fn.unveil=function(t,a){function s(){var t=g.filter(function(){var t=e(this);if(!t.is(":hidden")){var a=r.scrollTop(),s=a+r.height(),n=t.offset().top,o=n+t.height();return o>=a-i&&s+i>=n}});n=t.trigger("unveil"),g=g.not(n)}var n,r=e(window),i=t||0,o=window.devicePixelRatio>1,l=o?"data-src-retina":"data-src",g=this;return this.one("unveil",function(){var e=this.getAttribute(l);e=e||this.getAttribute("data-src"),e&&(this.setAttribute("src",e),"function"==typeof a&&a.call(this))}),r.on("scroll.unveil resize.unveil lookup.unveil",s),s(),this}}(window.jQuery||window.Zepto);var UNUSABLE_IMAGES=["Image:Inaccurate1_469.gif","Image:Spotlightnes3_241.png","Image:Info_317.png","Image:Barnstar.png","Image:LinkFA star.jpg","Image:Barnstar_of_Humour3_910.png","Image:WikiDefender_Barnstar_353.png","Image:Barnstar camera_91.png","Image:Stop hand_731.png","Image:ProtoClarity.png","Image:Template icon Needs editing_501.gif","Image:Template icon Needs editing_501.gif","Image:197px Copyright.svg.png","Image:Heckert_GNU_white_975.png","Image:FA candidate alpha.png","Image:Needs formatting_451.gif","Image:ATTENTION4.gif","Image:TITLE6.png","Image:InUseClock.png","Image:30px Apple_logo.gif","Image:Laptopnigeria.jpg","Image:Merge_590.png","Image:Inaccurate2.gif","Image:Page discussion_71.gif","Image:Photoround.png","Image:Magglass_326.png","Image:Furcongrat.png","Image:141123835_cf8cafd149.jpg","Image:Stop hand_731.png","Image:ProtoSplit.png","Image:Spotlightnes3_241.png","Image:Incomplete_856.gif","Image:172665796_c35bd3fbbe.jpg","Image:140030475_c8bd9744f2.jpg","Image:44771952_9b0223c408.jpg","Image:251140793_165d14e568.jpg","Image:Smile Face 180.jpg","Image:ProtoTitle.png","Image:AwardTeamStarUIB.png","Image:Dimanche_826.PNG","Image:GMTm5.png","Image:Crystal_email_474.png","Image:120px Flag_of_Australia.svg.png","Image:120px Flag_of_the_United_Kingdom.svg.png","Image:120px Flag_of_the_United_States.svg.png","Image:Firefoxlogo.png","Image:Face grin expert 8573.png","Image:IELogo.png","Image:Tux..png","Image:MacLogo_508.png","Image:Facesmilebig.png","Image:GMTm7.png","Image:GMTm8.png","Image:Exquisite kfind_376.png","Image:SAC6.png","Image:Face monkey_215.png","Image:UserAK.gif","Image:UserAL.gif","Image:UserAZ.gif","Image:WikiAdminUIB.png","Image:Microsoft logo.png","Image:IconDude.png","Image:24872178_1365e66ee6.jpg","Image:48840696_fd62f17b25.jpg","Image:182633915_1131e22a03.jpg","Image:JWM.gif","Image:JWM.gif","Image:Welcome_mat.jpg","Image:Boat.jpg","Image:Welcome_neon.jpg","Image:Welcome_mat.jpg"],STD_PUNCT=/[\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g,SEP_PUNCT=/["(),<>?@\[\]_{}]/g,NUM_INITIAL_IMAGES=2,MIN_PAGE_IMAGES=4,DEFAULT_INPUT_MESSAGE="How to...",$DOC=$(document),linkedPageId=getPageParameter(),promisedUsablePage=asyncQueryForRandomUsablePage(linkedPageId),gFirstScroll=!1,gDiff=0,gMobileLayout=!isGridActive(),styles2Nuke=[];$.when(promisedUsablePage.then(asyncQueryForPageImages),$DOC.data("readyDeferred")).done(addImagesToDocument),$DOC.data("readyDeferred",$.Deferred()).ready(function(){var e=$(".textField"),t=$(".toggle"),a=$(".game.panel");$.when(promisedUsablePage).done(pageFoundAction),$DOC.data("readyDeferred").resolve(),$DOC.data("fixedFloatWidth",a.width()),$DOC.data("fixedFloatLeft",a.offset().left),$(window).scroll(scrollAction),$(window).resize(resizeAction),$DOC.resize(resizeAction);var s=$(".gb");s.click(gPanelButtonPressedAction),$("#imagehint").click(addImageToDocument),$("#wordhint").click(giveWordHint),$(".card_overlay, button.card_close").click(closeCard),e.focus(focusedAction),e.keyup(keyupAction),e.blur(blurAction),t.change(slide),$(".close_link").click(closeOverlay),$(".copy_link").click(copyURL),$(".about").click(function(){overlayAction("about")}),$(".card_giveup").click(function(){overlayAction("loss")})});
//# sourceMappingURL=all.js.map
