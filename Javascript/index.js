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
var thisinterval = '';
    var inyoureye = ''
//document.querySelectorAll(".ytp-play-button")[0].title *pause *resume
setInterval(async function() {
    if (location.href == 'https://www.youtube.com/watch?v=xjOHEjINQUQ') { return; }
    const video_obj = JSON.parse(document.querySelectorAll('#scriptTag')[0].innerHTML);
    if (!video_obj) { return; }
    if (inyoureye == video_obj.name) { return; }
    if (inyoureye == '' || !video_obj.name == inyoureye || inyoureye.length != video_obj.name.length) {
        inyoureye = video_obj.name;
        try {
            async function getData() {
                const vid_obj = JSON.parse(document.querySelectorAll('#scriptTag')[0].innerHTML);
                const video_duration = document.querySelector('.ytp-time-current').textContent;
                const video_url = location.href;
                const timenow = document.querySelector('.ytp-time-duration').textContent;
                const thumbnail = video_obj.thumbnailUrl[0];//`https://i3.ytimg.com/vi/${location.href.split('=')[1].split('&')[0]}/maxresdefault.jpg`;
                const author = video_obj.author;
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
                    await new Promise((res, rej) => setTimeout(res,2500));
                    if (document.querySelector("#owner > ytd-video-owner-renderer > a") != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src) {
                        author_img = document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src;
                    }
                    else author_img = normal;
                }

                //console.log(video_obj,video_duration , video_duration , author_img, thumbnail , author);
                return {
                    vid_obj,video_duration,video_url,timenow,thumbnail,author,author_img
                }
            }

            const { vid_obj, video_duration,video_url,timenow,thumbnail,author,author_img } = await getData();


            if (vid_obj.name && video_duration && video_duration && author_img && thumbnail && author) {
                async function send(Author, Thumbnail, Image, Url, Title, Now, Duration) {
                    await fetch(`http://localhost:4400/?author=${encodeURIComponent(Author)}&thumbnail=${encodeURIComponent(Thumbnail)}&img=${encodeURIComponent(Image)}&url=${encodeURIComponent(Url)}&title=${encodeURIComponent(Title)}&time=${Duration}&end=${Now}`)
                }
                await send(author,thumbnail,author_img,video_url,vid_obj.name,timenow,video_duration);
                if (document.querySelector("#movie_player > div.video-ads.ytp-ad-module").childElementCount != 0) {
                    thisinterval = setInterval(async function() {
                        if (document.querySelector("#movie_player > div.video-ads.ytp-ad-module").childElementCount == 0) {
                            clearInterval(thisinterval)
                            await new Promise((res, rej) => setTimeout(res,1000));
                            const { vid_obj:a, video_duration:b,video_url:c,timenow:d,thumbnail:e,author:f, author_img:g } = await getData();
                            await send(f,e,g,c,a.name,d,b);
                        }
                        else {
                            return;
                        }
                    },500)
                }
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
//pause - resume
