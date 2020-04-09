var coords = [37.0902, -95.7129];
var mapZoomLevel = 3;

// Create the createMap function
var myMap = L.map("map", {
  center: coords,
  zoom: mapZoomLevel
});

// Create the tile layer that will be the background of our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);
// var markers
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


let mags = new Array()

function circle_creator (coords, fill, _rad){
	var circle = L.shapeMarker(coords, {
				fillColor: fill,
				fillOpacity: 1,
				color: "black",
				weight: 1,
				shape: "circle",
				radius: _rad
		});
	return circle;
} 

d3.json(url, function(error, response){
	
	if (error) throw error;
	// console.log(response);
	response.features.forEach((features=>{
		// console.log(features);
		var mag = features.properties.mag;
		var markers = L.markerClusterGroup()
		var coords = [features.geometry.coordinates[1], features.geometry.coordinates[0]]
		// var lat = features.geometry.coordinates[1];
		// var long = features.geometry.coordinates[0];

		// console.log("Lat: " + lat + "\n" + "Long: " + long);

		if (mag < 2){
			var circle = circle_creator(coords, "#FFCCCC", 2*(1+mag))	
		}

		else if (mag < 3){
			var circle = circle_creator(coords, "#FF9999", 2.5*(1+mag))	
		}

		else if (mag < 4){
			var circle = circle_creator(coords, "#FF6666", 3*(1+mag))	
		}

		else if (mag < 5){
			var circle = circle_creator(coords, "#FF3333", 4*(1+mag))	
		}

		else if (mag < 6){
			var circle = circle_creator(coords, "#FF0000", 5*(1+mag))	
		}

		else if (mag < 7){
			var circle = circle_creator(coords, "#CC0000", 6*(1+mag))	
		}

		else if (mag < 8){
			var circle = circle_creator(coords, "#990000", 7*(1+mag))	
		}

		else {
			var circle = circle_creator(coords, "#660000", 8*(1+mag))	
		}
		 circle.addTo(myMap)

	// if (lat && long){
 //    	markers.addLayer(L.marker([lat, long])
 //    		.bindPopup(features.properties.place + "<br>" + "Magnitude: " + features.properties.mag));
	// }
	// myMap.addLayer(markers);

})) 
	
}
);

var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["0-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8+"],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
function getColor(d) {
    return d === "0-2" ? '#800026' :
           d === "2-3"  ? '#BD0026' :
           d === "3-4"  ? '#E31A1C' :
           d === "4-5"  ? '#FC4E2A' :
           d === "5-6"   ? '#FD8D3C' :
           d === "6-7"   ? '#FEB24C' :
           d === "7-8"   ? '#FED976' :
                      '#FFEDA0';
}
legend.addTo(map);