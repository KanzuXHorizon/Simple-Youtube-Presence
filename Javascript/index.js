// ==UserScript==
// @name         Youtube Presense
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       KanzuWakazaki
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var inyoureye = ''
//document.querySelectorAll(".ytp-play-button")[0].title
setInterval(async function() {
    if (location.href == 'https://www.youtube.com/watch?v=xjOHEjINQUQ') { return; }
    const video_obj = JSON.parse(document.querySelectorAll('#scriptTag')[0].innerHTML);
    if (!video_obj) { return; }
    if (inyoureye == video_obj.name) { return; }
    if (inyoureye == '' || !video_obj.name == inyoureye || inyoureye.length != video_obj.name.length) {
        inyoureye = video_obj.name;
        const video_duration = document.querySelector('.ytp-time-current').textContent;
        const video_url = location.href;
        const timenow = document.querySelector('.ytp-time-duration').textContent;
        const thumbnail = video_obj.thumbnailUrl[0];//`https://i3.ytimg.com/vi/${location.href.split('=')[1].split('&')[0]}/maxresdefault.jpg`;
        const author = video_obj.author;
        const author_img = document.querySelectorAll('.style-scope .ytd-video-owner-renderer .no-transition')[0].childNodes[2].src.split('=')[0];
        try {
            console.log(video_obj,video_duration , video_duration , author_img, thumbnail , author);
        }
        catch (e) { console.log(e) }

        if (video_obj.name && video_duration && video_duration && author_img && thumbnail && author) {
            await fetch(`http://localhost:4400/?author=${encodeURIComponent(author)}&thumbnail=${encodeURIComponent(thumbnail)}&img=${encodeURIComponent(author_img)}&url=${encodeURIComponent(video_url)}&title=${encodeURIComponent(video_obj.name)}&time=${video_duration}&end=${timenow}`)
        }
        else {
            inyoureye = ''
            console.log('số')
        }
    }
    else console.log(112)
},500)


})();