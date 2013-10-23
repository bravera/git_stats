var http = require("http");
var fs = require('fs');
var url = 'https://api.github.com/repos/bravera/cloud_controller_ng/stats/contributors';
var cacheFile = './cachefile';
var connectedSockets = [];

function fetchJson() {
    http.get(url, function(res) {
        body = '';

        res.on('data', function(data) {
            body += data;
        });

        res.on('end', function() {
            fs.writeFileSync(cacheFile, body);
            setTimeout(fetchJson, 1000); // Fetch it again in a second
        });
    })
}

fetchJson(); // Start fetching to our JSON cache

// Start watching our cache file
fs.watch(cacheFile, function(event, filename) {
    if(event == 'change') {
        fs.readFile(cacheFile, function(data) {
            connectedSockets.forEach(function(socket) {
                socket.emit('data', JSON.parse(data));
            });
        });
    }
});