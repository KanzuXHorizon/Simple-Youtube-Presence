const ws = require('ws');


const client = new ws('ws://localhost:5540')

client.on("open", () => {
  
  });
  
  const ssid = ''
  client.on("message", (message) => {
    message = JSON.parse(message);
    if (message.Msg == 'Request Data') {
        client.send(JSON.stringify({ Type: 'getAll' }))
    }
    if (message.Msg == 'All') {
        console.log(message);
    }
    if (message.Msg == "Session_ID") {
        client.send(Type)
    }
  });