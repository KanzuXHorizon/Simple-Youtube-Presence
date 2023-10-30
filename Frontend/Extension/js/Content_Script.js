"use strict";
window.onload = async function() {
    //get - set - create session ID
    
    const snackbar = document.createElement("div");
    const Session_ID = JSON.parse(sessionStorage.getItem('yt-remote-session-app')).creation
    snackbar.id = "snackbar";

    snackbar.style.left = "50%";
    snackbar.style.transform = "translate(-50%, 0)";
    snackbar.style.visibility = "hidden";
    snackbar.style.minWidth = "250px";
    snackbar.style.margin = "0 5px 0 5px";
    snackbar.style.backgroundColor = "#333";
    snackbar.style.color = "#fff";
    snackbar.style.textAlign = "center";
    snackbar.style.borderRadius = "2px";
    snackbar.style.padding = "16px";
    snackbar.style.position = "fixed";
    snackbar.style.zIndex = "1";
    snackbar.style.bottom = "30px";

    document.body.appendChild(snackbar);

    function Notification (Msg) {
        snackbar.innerHTML = Msg;
        snackbar.style.visibility = 'visible'
        setTimeout(() => {
            snackbar.style.visibility = 'hidden'
        }, 3000)
    }

    let Ws_Server;
    let onProgress = 0;
    let isDisable = false;
    var interval_a;
    var interval_b;
    var thisinterval;
    var pinginterval;

    function connect() {
        Ws_Server = new WebSocket('ws:localhost:5540');

        Ws_Server.onopen = function() {
            pinginterval = setInterval(function() {
                Ws_Server.send(JSON.stringify({ Type: "Ping" }))
            }, 60 * 1000);
            Notification('Connected to Presence Server !');
        };

        Ws_Server.onmessage = async function(event) {
            const Message = JSON.parse(event.data)
            switch (Message.Msg) {
                case "Request Data": {
                    if (isDisable == true) return;
                    await Get_Data();
                }
                    break;
                case "Disable": {
                    return isDisable = true;
                }
                case "Enable": {
                    return isDisable = false;
                }
            }
        };

        Ws_Server.onclose = function() {
            console.log('WebSocket connection closed');
            clearInterval(interval_a);
            clearInterval(interval_b);
            clearInterval(pinginterval);
            reconnect();
        };
    }

    function reconnect() {
        if (onProgress == 1) return;
        else onProgress = 1
        setTimeout(function() {
            onProgress = 0
            console.log('Reconnecting WebSocket...');
            connect();
        }, 3000);
    }

    void connect();

    async function Get_Data() {
        var inyoureye = "";
        var update = 0;
        var completed = 0;
        //document.querySelectorAll(".ytp-play-button")[0].title *pause *resume
        interval_a = setInterval(async function() {
            if (isDisable == true) return;
            var video_obj;
            try {
                video_obj = JSON.parse(document.querySelectorAll("#scriptTag")[0].innerHTML);
            }
            catch (e) {
                await new Promise((re,rej) => setTimeout(re, 3000));
                video_obj = JSON.parse(document.querySelectorAll("#scriptTag")[0].innerHTML);
            }

            while (video_obj == undefined) {
                await new Promise((re,rej) => setTimeout(re, 1000));
                return video_obj = JSON.parse(document.querySelectorAll("#scriptTag")[0].innerHTML);
            }

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
                update = 0
                async function Update_Time() {
                    if (
                        !document.querySelectorAll(".ytp-play-button")[0].title.includes("Phát")
                    ) {
                        if (update == 0) {
                            update = 1
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
                    }
                };
                document.querySelector("#movie_player > div.html5-video-container > video").onmouseover = async function(){ 
                    await new Promise((r,j) => setTimeout(r, 1500))
                    await Update_Time();
                }
                document.onkeydown = async function(event) {
                    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        try {
                            await new Promise((r,j) => setTimeout(r, 1500))
                            update = 0
                            await Update_Time();
                            console.log(event.key);
                        }
                        catch (e) {
                            console.log(e);
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
                        timenow &&
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
                        interval_b = setInterval(async function() {

                            if (
                                document.querySelector(
                                    "#movie_player > div.video-ads.ytp-ad-module"
                                ) != undefined &&
                                document.querySelector(
                                    "#movie_player > div.video-ads.ytp-ad-module"
                                ).childElementCount != 0 &&
                                completed == 0
                            ) {
                                console.log('1222')
                                completed = 1;
                                thisinterval = setInterval(async function() {
                                    if (
                                        document.querySelector(
                                            "#movie_player > div.video-ads.ytp-ad-module"
                                        ).childElementCount == 0
                                    ) {
                                        clearInterval(thisinterval);
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
                                        completed = 0;
                                        thisinterval = ''
                                    } else {
                                        return;
                                    }
                                }, 500);
                            }
                        }, 1000)
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
            console.log(Now, Duration)
            if (isDisable) return;
            else return await Ws_Server.send(
                JSON.stringify({
                    Type: "Save_And_Update",
                    Data: {
                        Start: Duration
                        ,End: Now
                        ,Title: Title
                        ,Author_Name: Author
                        ,Author_Img: Image
                        ,Thumbnail: Thumbnail
                        ,Url: Url
                        ,Session_ID: Session_ID
                    }
                })
            )
        }

        async function getData() {
            const vid_obj = JSON.parse(
                document.querySelectorAll("#scriptTag")[0].innerHTML
            );
            const video_duration = document.querySelector(".ytp-time-current").textContent;
            const video_url = location.href;
            const timenow = document.querySelector(".ytp-time-duration").textContent;
            const thumbnail = vid_obj.thumbnailUrl[0]; //`https://i3.ytimg.com/vi/${location.href.split('=')[1].split('&')[0]}/maxresdefault.jpg`;
            const author = vid_obj.author;
            let author_img = "";
            await new Promise((res, rej) => setTimeout(res, 100));
            if (document.querySelector("#owner > ytd-video-owner-renderer > a") != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2] != undefined && document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src) {
                author_img = document.querySelector("#owner > ytd-video-owner-renderer > a").childNodes[0].childNodes[2].src;
            } else {
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
                author_img = HTML_DATA.match(/<link\s+rel="image_src"\s+href="(.*?)"/)[0].split('"')[3];
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
    }
}