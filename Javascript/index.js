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
        try {

            let author_img = '';
            const normal = ytInitialData.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.thumbnail.thumbnails[2].url;
            const dt = ytInitialData.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
                for (let i of dt) {
                    if (i.compactVideoRenderer != undefined && i.compactVideoRenderer.videoId != undefined) {
                        if (i.compactVideoRenderer.videoId == (video_obj.thumbnailUrl[0]).split('/')[4]) {
                            author_img = i.thumbnail != undefined ? i.thumbnail.thumbnails : i.compactVideoRenderer.channelThumbnail.thumbnails[0].url
                            break;
                        }
                    }
                }
                console.log(author_img || "empty athr");
            if (author_img == undefined || author_img == '') {
                if (document.querySelector("#owner > ytd-video-owner-renderer > a") != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src) {
                    author_img = document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src;
                }
                else if (ytInitialPlayerResponse.endscreen != undefined && ytInitialPlayerResponse.endscreen.endscreenRenderer.elements[0].endscreenElementRenderer.image.thumbnails[0].url != undefined) {
                    author_img = ytInitialPlayerResponse.endscreen.endscreenRenderer.elements[0].endscreenElementRenderer.image.thumbnails[0].url;
                }
                else author_img = normal;
            }

            console.log(video_obj,video_duration , video_duration , author_img, thumbnail , author);
            if (video_obj.name && video_duration && video_duration && author_img && thumbnail && author) {
                await fetch(`http://localhost:4400/?author=${encodeURIComponent(author)}&thumbnail=${encodeURIComponent(thumbnail)}&img=${encodeURIComponent(author_img)}&url=${encodeURIComponent(video_url)}&title=${encodeURIComponent(video_obj.name)}&time=${video_duration}&end=${timenow}`)
            }
            else {
                inyoureye = ''
                console.log('số')
            }
       }
        catch (e) { console.log(e) }
    }
    else console.log(112)
},500)


})();
