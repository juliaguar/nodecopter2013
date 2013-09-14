var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: false});
var arDrone = require('ar-drone');
var fs = require('fs');

var port = 3000;
server.listen(port);
console.log("Server listening on :" + port);

app.use(express.static('static'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + "/index.html");
});

var client = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');
client.config('video:video_channel', 0);
client.config('control:altitude_max', 3000);

io.sockets.on('connection', function (socket) {
  //socket.emit('drone', { hello: 'world' });

  socket.on('droneController', function(data) {
    console.log("Please: " + data.action);
    if(data.action == "stop")  client.stop(); 
    if(data.action == "land") { client.stop(); client.land(); }
    if(data.action == "up")  client.up(0.5); 
    if(data.action == "down") client.down(0.5);
    if(data.action == "left") client.counterClockwise(0.5);
    if(data.action == "right") client.clockwise(0.5);
    if(data.action == "front") client.front(0.5);
    if(data.action == "takeoff") client.takeoff();
  });

  client.on('navdata', function(event) {
  if(event) {
    var data = {
      altitude : event.demo.altitudeMeters,
      battery: event.demo.batteryPercentage,
      flying: event.droneState.flying,
      rotation: event.demo.rotation.leftRight
    };
    socket.emit('drone', data);
    if(data.altitude > 2.0) {
      console.log("Game over!");
      client.animateLeds('blinkRed', 5, 10);
    }
  }  
});

});


//client.takeoff();

// var pngStream = client.getPngStream();
// pngStream.on('data', function(data) {
//       fs.writeFile('/static/image.png', data, function(err) {
//         if(!err) console.log("Image saved." + altitude);
//       });
//     });

// client.after(20000, function() {
//     this.stop();
//     this.land();
//   });

//require('ar-drone-png-stream')(client, { port: 8000 });


/*
client
  .after(2000, function() {
    this.up(0.5);
  }) 
  .after(10000, function() {
    //console.log('stoping...')
    var pngStream = client.getPngStream();
    pngStream.on('data', function(data) {
      fs.writeFile(altitude + '.png', data, function(err) {
        if(!err) console.log("Image saved." + altitude);
      });
    });
    this.stop();
    this.land();
  });
*/