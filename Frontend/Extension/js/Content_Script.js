"use strict";
window.onload = function() {
    //get - set - create session ID

    const snackbar = document.createElement("div");
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
    let isDisable = false;
    let last_href;
    var Is_Ready = false;
    var update = 0;
    var AdsProgress = false;
    var retry = 0;

    const observer = new MutationObserver(async(mutations) => {
        if (mutations[0].addedNodes.length > 0) {
            if (document.querySelector("#movie_player > div.video-ads.ytp-ad-module") != undefined && document.querySelector("#movie_player > div.video-ads.ytp-ad-module").childElementCount != 0) {
                return Notification('Đang chờ quảng cáo...');
            }
        }

        if (mutations[0].removedNodes.length != 0) {
            if (document.querySelector("#movie_player > div.video-ads.ytp-ad-module") != undefined && document.querySelector("#movie_player > div.video-ads.ytp-ad-module").childElementCount == 0) {
                if (AdsProgress) return;
                else AdsProgress = true; 
                const { vid_obj,video_duration,video_url,timenow,thumbnail,author,author_img } = await getData();
                return await send(author,thumbnail,author_img,video_url,vid_obj.name,timenow,video_duration);
            }
        }

        if (mutations[0].type == 'attributes' && mutations[0].target.id == 'scriptTag') {
            //only 1 time
            return Start_Crawl_Data();
        }
    });

    async function Connect_To_Ws_Presence(Tried) {
        try {
            if (Tried == 1) { 
                Ws_Server = new WebSocket("ws://localhost:5540");
    
                Ws_Server.onopen = function () {
                    Notification("Connected to Presence Server !");
                };
    
                Ws_Server.onmessage = async function (event) {
                    const Message = JSON.parse(event.data);
    
                switch (Message.Msg) {
                        case "Request Data": {
                            Start_Crawl_Data();
                        }
                            break;
                        case "Disable": {
                            return (isDisable = true);
                        }
                        case "Enable": {
                            return (isDisable = false);
                        }
                    }
                };
    
                Ws_Server.onerror = function (a) {
                    console.log(a);
                };
    
                Ws_Server.onclose = function () {
                    Is_Ready = false;
                    Destroy();
                    Connect_To_Ws_Presence();
                    console.log("WebSocket connection closed");
    
                };
            }
            else {
                var Temp_Checking = new WebSocket("ws://localhost:5540");
                Temp_Checking.onmessage = async function (event) {
                    const Message = JSON.parse(event.data);
                    switch (Message.Msg) {
                        case "Request Data": {
                            Temp_Checking.close();
                            Is_Ready = true;
                            await new Promise((r,j) => setTimeout(r, 500))
                            Connect_To_Ws_Presence(1);
                        }
                    }
                };
                    console.log('On Checking...')
                    setTimeout(() => {
                        if (Is_Ready == true) return;
                        else Connect_To_Ws_Presence();
                    },2500)
    
            }
        } 
        catch (e) {
            console.log(e);
        }
    }

    void Connect_To_Ws_Presence();

    async function Update_Data(Allow) {

        if (!document.querySelectorAll(".ytp-play-button")[0].title.includes("Phát")) {
            if (update == 0 || Allow == true && retry != 4) {
                update = 1
                const { vid_obj,video_duration,video_url,timenow,thumbnail,author,author_img } = await getData();
                if (vid_obj.name && video_duration && video_duration && author_img && thumbnail && author) {
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
                    console.log("UPDATE DATA ERROR");
                    await new Promise((r,j) => setTimeout(r, 1500));
                    retry += 1
                    Update_Data(Allow)
                }
            }
            else if (retry == 3) retry = 0;
        }
    }

    async function getVideoObject() {
        if (document.querySelectorAll("#scriptTag")[0] == undefined) { 
            await new Promise((r,e) => setTimeout(r, 2300));
            return getVideoObject();
        }
        const scriptTagContent = document.querySelectorAll("#scriptTag")[0].innerHTML;
        try {
            return JSON.parse(scriptTagContent);
        } catch (e) {
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            return getVideoObject();
        }
    }

    async function Destroy() {
        observer.disconnect();
        //pause video
        document.querySelector("#movie_player > div.html5-video-container > video").onclick = function() {};

        //pause - resume button
        document.querySelectorAll(".ytp-play-button")[0].onclick = function() {}

        //progress bar
        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container").onclick = function() {};

        //change
        document.onkeydown = function() {};

        update = 0;
        AdsProgress = false;
    }

    async function Start_Crawl_Data() {
        if (isDisable == true) return;
        let video_obj = await getVideoObject();
        if (video_obj == '') video_obj = await getVideoObject();
        //check (next video)
        observer.observe(document.querySelector("#scriptTag"), {
            attributes: true
        });

        //Ads check
        observer.observe(document.querySelector("#movie_player"), {
            childList: true,
            subtree: true
        });

        //onetime run

        document.querySelector("#movie_player > div.html5-video-container > video").mouseover = function() {
            return Update_Data(1)
        }

        //pause video
        document.querySelector("#movie_player > div.html5-video-container > video").onclick = function() {
            if (update == 1) update = 0; 
            return Update_Data();
        }

        //pause - resume button
        document.querySelectorAll(".ytp-play-button")[0].onclick = function () {
            if (update == 1) update = 0; 
            return Update_Data();
        }

        //progress bar
        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container").onclick = function() { 
            if (update == 1) update = 0; 
            return Update_Data();
        }

        //change
        document.onkeydown = function(event) {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === " ") {
                try {
                    if (update == 1) update = 0; 
                    return Update_Data();
                }
                catch (e) {
                    console.log(e);
                }
            }
        };
        const { vid_obj,video_duration,video_url,timenow,thumbnail,author,author_img } = await getData();
        if (vid_obj.name &&video_duration &&timenow &&video_url &&author_img &&thumbnail &&author) {
            await send(author,thumbnail,author_img,video_url,vid_obj.name,timenow,video_duration);
        } 
        else return Start_Crawl_Data(1);
    }

    async function send(Author, Thumbnail, Image, Url, Title, Now, Duration) {
        console.log(Now, Duration);
        const Session_ID = JSON.parse(sessionStorage.getItem('yt-remote-session-app')).creation
        if (isDisable) return;
        else if (Ws_Server.readyState == 0) {
            return Destroy();
        }
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
        const vid_obj = await getVideoObject();
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
                    "referrer": location.href,
                    "referrerPolicy": "origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                });
                Data_Vid = await Data_Vid.json();
            try {
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
            catch (e) {
                author_img = "https://yt3.ggpht.com/xCLp0BoYL6zzoUPNG37B9tpvrNWxcvhTDPqHhQ37iPp3EA_PiwnHfe5n-fa6WLlUfR7jqUxT4A=-c-k-c0x00ffffff-no-rj"
            }
        }

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