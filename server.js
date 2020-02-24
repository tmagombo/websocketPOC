const express = require('express')
const app = express()
const WebSocket = require('ws')
const uuid = require('uuid')

const wss = new WebSocket.Server({ port: 40510 })
var connectedUsers = {}

wss.on('connection', function connection(ws, req) {
  ws.id = uuid.v4()
  if (req.url !== '/page') {
    ws.on('message', function listener(data) {
      var newData = JSON.parse(data)
      connectedUsers[ws.id] = newData
      console.log('connection open')
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(connectedUsers));
      });
    });
    ws.on('close', function listener() {
      console.log('connection closed')
      delete connectedUsers[ws.id]
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(connectedUsers));
      });
    })
  }
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ws.html')
})

app.get('/page', function (req, res) {
  res.sendFile(__dirname + '/ws2.html')
  setTimeout(function () { console.log(connectedUsers) }, 1000)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})