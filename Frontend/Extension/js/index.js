//add button choose

window.onload = async function() {

    function Notification (Msg) {
        const snackbar = document.getElementById('snackbar')
        snackbar.innerHTML = Msg;
        snackbar.style.visibility = 'visible'
        snackbar.onclick = function(e) {
            e.preventDefault();
            snackbar.style.visibility = 'hidden';
        }
        setTimeout(() => {
            snackbar.style.visibility = 'hidden'
        }, 3000)
    }

    const Table = document.getElementById('table');

    //connect ws
    let Ws_Server;
    let onProgress = 0;

    function connect() {
        Ws_Server = new WebSocket('ws:localhost:5540');

        Ws_Server.onopen = function() {
            Notification('Connected to Presence Server !');
        };

        Ws_Server.onmessage = async function(event) {
            const Message = JSON.parse(event.data)
            switch (Message.Msg) {
                case "Request Data": {
                    return await Ws_Server.send(
                        JSON.stringify({
                            Type: "getAll"
                        })
                    )
                }
                case "All": {
                    const All_Client = Message.Data;
                    let max_colum = 3;
                    let row_length = 0;
                    for (let i of All_Client) {
                        if (max_colum == 3 || max_colum == 0) {
                            try {
                                row_length = row_length += 1
                                const row = document.createElement('div');
                                    row.className = 'row';
                                    row.id = "R" + row_length;
                                const button = document.createElement('button');
                                    button.classList.add('button')
                                    button.id = i.Number;
                                if (i.Status == true) { button.classList.add('onActive') }
                                    button.innerHTML = (i.Title).slice(0,20) + '...'
                                    button.onclick = async function(e) {
                                        e.preventDefault();
                                        Ws_Server.send(JSON.stringify({ Type: "Change", Data: { Number: button.id } }))
                                    }
                                row.appendChild(button);
                                Table.appendChild(row);
                                max_colum = max_colum-=1;
                            }
                            catch (e) {
                                console.log(e)
                            }
                        }
                        else {
                            try {
                                let old_row = document.getElementById('R' + row_length)
                                const button = document.createElement('button');
                                    button.classList.add('button')
                                    button.id = i.Number;
                                if (i.Status == true) button.classList.add('onActive')
                                    button.innerHTML = (i.Title).slice(0,20) + '...';
                                    button.onclick = async function(e) {
                                        e.preventDefault();
                                        Ws_Server.send(JSON.stringify({ Type: "Change", Data: { Number: button.id } }))
                                    }
                                old_row.appendChild(button);
                                max_colum--;
                            }
                            catch (e) { console.log(e)}
                        }
                    }
                }
                    break;
                case "Success Change": {
                    Notification('Thay Đổi Thành Công !');
                    await new Promise((re,j) => setTimeout(re, 1500))
                    return location.reload();
                }
            }
        };

        Ws_Server.onerror = function(error) {
            reconnect();
        };

        Ws_Server.onclose = function() {
            Notification('WebSocket connection closed');
            reconnect();
        };
    }

    function reconnect() {
        if (onProgress == 1) return;
        else onProgress = 1
        setTimeout(function() {
            Notification('Reconnecting WebSocket...');
            connect();
            onProgress = 0
        }, 3000);
    }
    
    void connect();
    
}