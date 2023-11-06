const websocket = require('ws');
const rpc = require("discord-rpc");
const isOnline = require('is-online');
const client = new rpc.Client({ transport: 'ipc' });
const Websocket = new websocket.Server({ port: 5540 });
const Session = {}
var New_Title;

process.on('exit', function() { 
    void a();
})

async function a() {
    if (!(await isOnline())) {
        await b();
    }
    else if (await isOnline()) {
        await c();
    }
}

async function b() { 
    if (!(await isOnline())) {
        await a();
    }
    else if (await isOnline()) {
        await c();
    }
}

void a();


async function c() { 
    console.log('Good')
    client.login({ clientId: '1111142866379620372' }).catch(e => a());

    client.on('ready', () => {
        Websocket.on('connection', function(WebSocket, request) {
            WebSocket.send(JSON.stringify({ Msg: "Request Data"}));
            Websocket.on('error', function(e) { console.log(e) })
            WebSocket.on('message', function(message) {
                message = JSON.parse(message);
                switch (message.Type) {
                    case 'Save_And_Update': {
                        const { Start,End,Title,Author_Name,Author_Img,Thumbnail,Url,Session_ID } = message.Data;
                        if ( !Start || !End || !Title || !Author_Name || !Author_Img || !Thumbnail || !Url) {
                            console.log("code 1")
                            console.log(Start,End,Title,Author_Name,Author_Img,Thumbnail,Url)
                        }
                        var Ws_Client;
                        if (Session[Session_ID] == undefined) {
                            if (Object.keys(Session).length == 0) {
                                Session[Session_ID] = { Status: true, Number: Object.keys(Session).length + 1, WebSocket, Title: Title };
                            }
                            else {
                                Session[Session_ID] = { Status: false, Number: Object.keys(Session).length + 1, WebSocket, Title: Title }
                            }
                            Ws_Client = Session[Session_ID]
                        }
                        else {
                            Session[Session_ID].Title = Title;
                            Ws_Client = Session[Session_ID];
                        }

                        const All = Object.keys(Session);
                        const List = [];
                        //1: OPEN, 3:CLOSE
                        for (let i of All) {
                            if ((Session[i]).WebSocket._readyState == 1) {
                                List.push(Session[i]);
                            } else if ((Session[i]).WebSocket._readyState == 3) {
                                continue;
                            }
                        }

                        if (!List.find(i => i.Status == true)) {
                            List[0].Status = true;
                            Ws_Client = List[0];
                        } 

                        if (Ws_Client.Status == true) {
                            Handle_Data_And_Update(Start,End,Title,Author_Name,Author_Img,Thumbnail,Url);
                        }
                    }
                        break;
                    case "getAll": {
                        //Check And Get
                        const All = Object.keys(Session);
                        const List = [];
                        //1: OPEN, 3:CLOSE
                        for (let i of All) {
                            if ((Session[i]).WebSocket._readyState == 1) {
                                List.push(Session[i]);
                            } else if ((Session[i]).WebSocket._readyState == 3) {
                                continue;
                            }
                        }
                        return WebSocket.send(
                            JSON.stringify({
                                Msg: "All",
                                Data: List
                            })
                        )
                    }
                    case "Change": {
                        const { Number:Num } = message.Data;
                        if (!Num) {
                            console.log('code 2', Num);
                        }
                        else {
                            let All = Object.keys(Session);
                            let List = [];
                            //1: OPEN, 3:CLOSE
                            for (let i of All) {
                                if ((Session[i]).WebSocket._readyState == 1) {
                                    List.push(Session[i]);
                                } else if ((Session[i]).WebSocket._readyState == 3) {
                                    delete Session[i];
                                    continue;
                                }
                            }
                            let Old = List.find(i => i.Status == true);
                                if (Old) {
                                    Old.Status = false;
                                }
                            let New = List.find(i => i.Number == Num)
                                if (New) {
                                    New.Status = true;
                                    New.WebSocket.send(JSON.stringify({ Msg: "Request Data" }))
                                }
                            return WebSocket.send(JSON.stringify({ Msg: "Success Change" }))
                        }
                    }
                }
            })
        }) 
    })
        
    //TODO: PING CHECK

    async function Handle_Data_And_Update(Start,End,Title,Author_Name,Author_Img,Thumbnail,Url) {
        // const Simple_End_Duration = {
        //     End_Mili_Sec: (parseInt(End.split(':')[0]) * 60 * 1000)  + End.split(':')[1] * 1000
        // }

        var format = Start.split(':');
            if (format.length == 2) {
                format = {
                    min_mili: format[0] * 60 * 1000,
                    sec_mili: (parseInt(format[1])) * 1000
                }
                format =  parseInt(format.min_mili) + parseInt(format.sec_mili)
            }
            else {
                format = {
                    hour_mili: (parseInt(format[0])) * 3600 * 1000,
                    min_mili: parseInt(format[1] * 60 * 1000),
                    sec_mili: (parseInt(format[2])) * 1000
                }
                format = parseInt(format.hour_mili) + parseInt(format.min_mili) + parseInt(format.sec_mili);
            }
            

        var format2 = End.split(':');
        if (format2.length == 2) {
            format2 = {
                min_mili: parseInt(format2[0] * 60 * 1000),
                sec_mili: (parseInt(format2[1])) * 1000
            }
            format2 = parseInt(format2.min_mili) + parseInt(format2.sec_mili);
        }
        else {
            format2 = {
                hour_mili: (parseInt(format2[0])) * 3600 * 1000,
                min_mili: parseInt(format2[1] * 60 * 1000),
                sec_mili: (parseInt(format2[2])) * 1000
            }
            format2 = parseInt(format2.hour_mili) + parseInt(format2.min_mili) + parseInt(format2.sec_mili);
        }
        if (New_Title != Title) {
            console.log(Title, Start, End)
            New_Title = Title
        }

        request(format,format2,Title,Author_Name,Author_Img,Thumbnail,Url)
    }

    function request(format,End,Title,Author_Name,Author_Img,Thumbnail,Url) {
        //TODO: Add pause event, handle realtime
        const cr = {
            pid: process.pid,
            activity: {
                details:Title,
                state: Author_Name ,
                timestamps: {
                    start: Date.now(),
                    end: Date.now() + (parseInt(End) - format)
                },
                assets: {
                    large_image: Thumbnail,
                    large_text: Title,
                    small_image: Author_Img,
                    small_text: Author_Name,
                },
                buttons: [{
                        label: "🎧 Chơi Trên Youtube",
                        url: Url
                    },
                    {
                        label: '🎯 My Facebook',
                        url: 'https://www.facebook.com/Lazic.Kanzu/'
                    },
                ],
                instance: true
            }
        }
        client.request('SET_ACTIVITY', cr)
    }
}
