const express = require('express');
const cors = require('cors');
const rpc = require("discord-rpc");
const client = new rpc.Client({ transport: 'ipc' });
const axios = require('axios');


void async function Loop_Check_And_Run() {
    try { 
        await axios.get('https://discord.com/');
        await Start();
    }
    catch (e) {
        Loop_Check_And_Run();
    }
}()

async function Start() { 
    client.login({ clientId: '1111142866379620372' }).catch(console.error);
    client.on('ready', () => {
        const app = express();
        app.use(cors())
        app.get('/', function (req,res,n) {
            const title = req.query.title;
            const url = req.query.url;
            const time = req.query.time
            const end_time = req.query.end;
            const author = req.query.author;
            const thumbnail = req.query.thumbnail;
            const startTime = req.query.StartTime;
            const img = req.query.img
            var format = time.split(':');
                format = {
                    min_mili: format[0] * 60 * 1000,
                    sec_mili: (parseInt(format[1]) + 2) * 1000
                }
                format =  format.min_mili + format.sec_mili
            var format2 = end_time.split(':');
            if (format2.length == 2) {
                format2 = {
                    min_mili: parseInt(format2[0] * 60 * 1000),
                    sec_mili: (parseInt(format2[1]) + 4) * 1000
                }
                format2 = format2.min_mili + format2.sec_mili;
            }
            else {
                format2 = {
                    hour_mili: (parseInt(format2[0])) * 3600 * 1000,
                    min_mili: parseInt(format2[1] * 60 * 1000),
                    sec_mili: (parseInt(format2[2]) + 4) * 1000
                }
                format2 = format2.hour_mili + format2.min_mili + format2.sec_mili;
            }
                console.log(title)
                request(format,url,title,format2,author,thumbnail,img,startTime)
            return res.json({ Status: "Success"});
        })

        app.listen(4400, () => {
            console.log('listen 4400 port')
        })

    })

    function request(format,url,title,end_time,author, thumbnail, img,startTime) {
        const cr = {
            pid: process.pid,
            activity: {
                details:title,
                state: author ,
                timestamps: {
                    start: parseInt(startTime),
                    end: parseInt(startTime) + (end_time - format)
                },
                assets: {
                    large_image: thumbnail,
                    large_text: title,
                    small_image: img,
                    small_text: author,
                },
                buttons: [{
                        label: "🎧 Chơi Trên Youtube",
                        url: url
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