var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.takeoff();

client
  .after(5000, function() {
    this.up(0.7);
  })
  .after(3000, function() {
    this.animate('flipLeft', 3000);
  })
  .after(4000, function() {
    this.stop();
    this.land();
  });
