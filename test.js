var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('drone', { hello: 'world' });
});


var arDrone = require('ar-drone');
var client = arDrone.createClient();
var fs = require('fs');

//client.takeoff();

client.config('general:navdata_demo', 'FALSE');
client.config('video:video_channel', 0);
var altitude;
client.on('navdata', function(event) {
  if(event) {
    fs.appendFile('log.txt', JSON.stringify(event, undefined, 2));
  }  
  //console.log("altitudeMeters: " + event.demo.altitudeMeters);
  altitude = event.demo.altitudeMeters;
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