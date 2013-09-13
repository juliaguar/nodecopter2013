var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
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
  client.on('navdata', function(event) {
  if(event) {
    var data = {
      altitude : event.demo.altitudeMeters,
      battery: event.demo.batteryPercentage,
      flying: event.droneState.flying,
      rotation: event.demo.rotation.leftRight
    };
    socket.emit('drone', data);
  }  
});

});


client.takeoff();

var pngStream = client.getPngStream();
pngStream.on('data', function(data) {
      fs.writeFile('/static/image.png', data, function(err) {
        if(!err) console.log("Image saved." + altitude);
      });
    });

client.after(5000, function() {
    this.stop();
    this.land();
  });

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