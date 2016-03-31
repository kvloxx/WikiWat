/*
Diacritics2Url
Converts any string to an readable URL.
https://github.com/MOuli90/Diacritics2Url

Copyright (c) 2014, Alexander Kopp
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

* Neither the name of the {organization} nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 DAMAGE
*/
!function(e){function t(e){return e.replace(/[^\u0000-\u0020\u0041-\u00A0\u0030-\u0039]/g,function(e){return r[e.charCodeAt(0)]||e})}function s(e){return e=t(e),e=e.toLocaleLowerCase(),e=e.replace(/[^a-z0-9]/g,"-"),e=e.replace(/\-{2,}/g,"-"),e=e.replace(/^-|-$/g,""),escape(e)}for(var a=[{base:"A",letters:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",letters:"Ꜳ"},{base:"AE",letters:"ÆǼǢｮ"},{base:"Ae",letters:"Ä"},{base:"AO",letters:"Ꜵ"},{base:"AU",letters:"Ꜷ"},{base:"AV",letters:"ꜸꜺ"},{base:"AY",letters:"Ꜽ"},{base:"a",letters:"ªaⓐａẚàáâầấẫẩãāăằắẵẳȧǡǟảåǻǎȁȃạậặḁąⱥɐ"},{base:"aa",letters:"ꜳ"},{base:"ae",letters:"æǽǣä"},{base:"ao",letters:"ꜵ"},{base:"at",letters:"@＠"},{base:"au",letters:"ꜷ"},{base:"av",letters:"ꜹꜻ"},{base:"ay",letters:"ꜽ"},{base:"B",letters:"BⒷＢḂḄḆɃƂƁ"},{base:"b",letters:"bⓑｂḃḅḇƀƃɓ"},{base:"C",letters:"©CⒸＣĆĈĊČÇḈƇȻꜾｩ"},{base:"c",letters:"cⓒｃćĉċčçḉƈȼꜿↄ"},{base:"D",letters:"ÐDⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"},{base:"DZ",letters:"ǱǄ"},{base:"Dz",letters:"ǲǅ"},{base:"d",letters:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{base:"dz",letters:"ǳǆ"},{base:"E",letters:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{base:"e",letters:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{base:"F",letters:"FⒻＦḞƑꝻ"},{base:"f",letters:"fⓕｆḟƒꝼ"},{base:"G",letters:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{base:"g",letters:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{base:"H",letters:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"h",letters:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",letters:"ƕ"},{base:"I",letters:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"IJ",letters:"Ĳ"},{base:"i",letters:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"ij",letters:"ĳ"},{base:"J",letters:"JⒿＪĴɈ"},{base:"j",letters:"jⓙｊĵǰɉ"},{base:"K",letters:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"k",letters:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"L",letters:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",letters:"Ǉ"},{base:"Lj",letters:"ǈ"},{base:"l",letters:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{base:"lj",letters:"ǉ"},{base:"M",letters:"MⓂＭḾṀṂⱮƜ"},{base:"m",letters:"mⓜｍḿṁṃɱɯ"},{base:"N",letters:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{base:"NJ",letters:"Ǌ"},{base:"Nj",letters:"ǋ"},{base:"n",letters:"nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"},{base:"nj",letters:"ǌ"},{base:"O",letters:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"Oe",letters:"Ö"},{base:"OI",letters:"Ƣ"},{base:"OO",letters:"Ꝏ"},{base:"OU",letters:"Ȣ"},{base:"o",letters:"oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{base:"oe",letters:"ö"},{base:"oi",letters:"ƣ"},{base:"ou",letters:"ȣ"},{base:"oo",letters:"ꝏ"},{base:"P",letters:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"p",letters:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{base:"Q",letters:"QⓆＱꝖꝘɊ"},{base:"q",letters:"qⓠｑɋꝗꝙ"},{base:"R",letters:"®RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂｨ"},{base:"r",letters:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"S",letters:"SⓈＳŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"SS",letters:"ẞ"},{base:"s",letters:"sⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{base:"ss",letters:"ßｧ"},{base:"T",letters:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"TZ",letters:"Ꜩ"},{base:"TM",letters:"ｪ"},{base:"t",letters:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"tz",letters:"ꜩ"},{base:"U",letters:"UⓊＵÙÚÛŨṸŪṺŬǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"Ue",letters:"Ü"},{base:"u",letters:"uⓤｕùúûũṹūṻŭǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"ue",letters:"ü"},{base:"V",letters:"VⓋＶṼṾƲꝞɅ"},{base:"VY",letters:"Ꝡ"},{base:"v",letters:"vⓥｖṽṿʋꝟʌ"},{base:"vy",letters:"ꝡ"},{base:"W",letters:"WⓌＷẀẂŴẆẄẈⱲ"},{base:"w",letters:"wⓦｗẁẃŵẇẅẘẉⱳ"},{base:"X",letters:"XⓍＸẊẌ"},{base:"x",letters:"xⓧｘẋẍ"},{base:"Y",letters:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"y",letters:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"Z",letters:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"z",letters:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"},{base:"0",letters:"0０"},{base:"1",letters:"1¹１"},{base:"2",letters:"2²２"},{base:"3",letters:"3³３"},{base:"4",letters:"4４"},{base:"5",letters:"5５"},{base:"6",letters:"6６"},{base:"7",letters:"7７"},{base:"8",letters:"8８"},{base:"9",letters:"9９"}],r={},l=0;l<a.length;l++)for(var b=a[l].letters.split(""),c=0;c<b.length;c++)r[b[c].charCodeAt(0)]=a[l].base;e.diacritics2url=s,e.diacritics2url.replaceDiacritics=t}(window);