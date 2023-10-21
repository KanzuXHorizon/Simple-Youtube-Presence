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

(function () {
        "use strict";
        if (location.href == "https://www.youtube.com/watch?v=xjOHEjINQUQ") {
          return;
        }
        var thisinterval = "";
        var inyoureye = "";
          var StartTime;
        //document.querySelectorAll(".ytp-play-button")[0].title *pause *resume
        setInterval(async function () {
          const video_obj = JSON.parse(
            document.querySelectorAll("#scriptTag")[0].innerHTML
          );
          if (!video_obj) {
            return;
          }
          if (inyoureye == video_obj.name) {
            return;
          }
          if (
            inyoureye == "" ||
            !video_obj.name == inyoureye ||
            inyoureye.length != video_obj.name.length
          ) {
             StartTime = Date.now();
              document
          .querySelector("#movie_player > div.html5-video-container > video").onmouseover =  async function () {
            if (
              !document.querySelectorAll(".ytp-play-button")[0].title.includes("Phát")
            ) {
              console.log("hello");
              const {
                vid_obj,
                video_duration,
                video_url,
                timenow,
                thumbnail,
                author,
                author_img,
              } = await getData();
              if (
                vid_obj.name &&
                video_duration &&
                video_duration &&
                author_img &&
                thumbnail &&
                author
              ) {
                await send(
                  author,
                  thumbnail,
                  author_img,
                  video_url,
                  vid_obj.name,
                  timenow,
                  video_duration
                );
              } else {
                inyoureye = "";
                console.log("số");
              }
            }
          };
            inyoureye = video_obj.name;
            try {
              const {
                vid_obj,
                video_duration,
                video_url,
                timenow,
                thumbnail,
                author,
                author_img,
              } = await getData();

              if (
                vid_obj.name &&
                video_duration &&
                video_duration &&
                author_img &&
                thumbnail &&
                author
              ) {
                await send(
                  author,
                  thumbnail,
                  author_img,
                  video_url,
                  vid_obj.name,
                  timenow,
                  video_duration
                );
                if (
                  document.querySelector(
                    "#movie_player > div.video-ads.ytp-ad-module"
                  ) != undefined &&
                  document.querySelector(
                    "#movie_player > div.video-ads.ytp-ad-module"
                  ).childElementCount != 0
                ) {
                  thisinterval = setInterval(async function () {
                    if (
                      document.querySelector(
                        "#movie_player > div.video-ads.ytp-ad-module"
                      ).childElementCount == 0
                    ) {
                      clearInterval(thisinterval);
                      StartTime = Date.now();
                      await new Promise((res, rej) => setTimeout(res, 1000));
                      const {
                        vid_obj: a,
                        video_duration: b,
                        video_url: c,
                        timenow: d,
                        thumbnail: e,
                        author: f,
                        author_img: g,
                      } = await getData();
                      await send(f, e, g, c, a.name, d, b);
                    } else {
                      return;
                    }
                  }, 500);
                }
              } else {
                inyoureye = "";
                console.log("số");
              }
            } catch (e) {
              console.log(e);
            }
          } else console.log(112);
        }, 500);
        async function send(Author, Thumbnail, Image, Url, Title, Now, Duration) {
          await fetch(
            `http://localhost:4400/?author=${encodeURIComponent(
              Author
            )}&thumbnail=${encodeURIComponent(Thumbnail)}&img=${encodeURIComponent(
              Image
            )}&url=${encodeURIComponent(Url)}&title=${encodeURIComponent(
              Title
            )}&time=${Duration}&end=${Now}&StartTime=${StartTime}`
          );
        }

        async function getData() {
          const vid_obj = JSON.parse(
            document.querySelectorAll("#scriptTag")[0].innerHTML
          );
          const video_duration =
            document.querySelector(".ytp-time-current").textContent;
          const video_url = location.href;
          const timenow = document.querySelector(".ytp-time-duration").textContent;
          const thumbnail = vid_obj.thumbnailUrl[0]; //`https://i3.ytimg.com/vi/${location.href.split('=')[1].split('&')[0]}/maxresdefault.jpg`;
          const author = vid_obj.author;
          let author_img = "";
          await new Promise((res, rej) => setTimeout(res, 100));
            if (document.querySelector("#owner > ytd-video-owner-renderer > a") !=undefined &&document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0] != undefined &&document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2] != undefined &&document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src) {
              author_img = document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src;
            }
            else {
              var Data_Vid = await fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(location.href), {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                  "cache-control": "no-cache",
                  "pragma": "no-cache",
                  "sec-ch-ua": "\"Chromium\";v=\"118\", \"Brave\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-model": "\"\"",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-ch-ua-platform-version": "\"15.0.0\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "sec-gpc": "1"
                },
                "referrer": "https://www.youtube.com/watch?v=9ysbdDJf_-o&list=RDMM8DctFpIBC9Q&index=11",
                "referrerPolicy": "origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
              });
              Data_Vid = await Data_Vid.json();

              var HTML_DATA = await fetch(Data_Vid.author_url, {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                  "cache-control": "no-cache",
                  "pragma": "no-cache",
                  "sec-ch-ua": "\"Chromium\";v=\"118\", \"Brave\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-model": "\"\"",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-ch-ua-platform-version": "\"15.0.0\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "sec-gpc": "1"
                },
                "referrer": location.href,
                "referrerPolicy": "origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
              });
              HTML_DATA = await HTML_DATA.text();
              author_img = HTML_DATA.match(  /<link\s+rel="image_src"\s+href="(.*?)"/)[0].split('"')[3];
            }

          //console.log(video_obj,video_duration , video_duration , author_img, thumbnail , author);
          return {
            vid_obj,
            video_duration,
            video_url,
            timenow,
            thumbnail,
            author,
            author_img,
          };
        }
      })();
      //pause - resume
