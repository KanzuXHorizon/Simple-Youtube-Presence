const ws = require("ws");

const server = new ws.Server({ port: 5540 });

server.on("connection", (ws,req) => {
    console.log(req)
  // Khi một client kết nối, hãy gửi cho họ một tin nhắn chào mừng
  

  // Khi client gửi một tin nhắn, hãy in nó ra console
  ws.on("message", (message,b) => {
    console.log("Client: " + message);
    ws.send("Chào mừng bạn đến với máy chủ websocket của chúng tôi!");
  });
});

