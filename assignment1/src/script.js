console.log("Omri Loh")

// Define a variable for Tel Aviv's coordinates
var telAvivCoordinates = [32.0853, 34.7818];

var mymap = L.map('mapid').setView(telAvivCoordinates, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
}).addTo(mymap);
