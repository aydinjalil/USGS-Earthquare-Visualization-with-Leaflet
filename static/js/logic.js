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



function circle_creator (features, fill, _rad){
	console.log(features);
	var circle = L.shapeMarker([features.geometry.coordinates[1], features.geometry.coordinates[0]], {
				fillColor: fill,
				fillOpacity: 1,
				color: "black",
				weight: 1,
				shape: "circle",
				radius: _rad
		}).bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>" + 
      "<hr><p>" + "Magnitude: " + features.properties.mag + "</p>");
	return circle;
} 



d3.json(url, function(error, response){
	
	if (error) throw error;
	// console.log(response);
	response.features.forEach((features=>{
		// console.log(features);
		var mag = features.properties.mag;
		// var markers = L.markerClusterGroup()
		var coords = [features.geometry.coordinates[1], features.geometry.coordinates[0]]
		// var lat = features.geometry.coordinates[1];
		// var long = features.geometry.coordinates[0];

		// console.log("Lat: " + lat + "\n" + "Long: " + long);
		if (coords)
			if (mag < 2){
				var circle = circle_creator(features, "#FFCCCC", 2*(1+mag))	
			}

			else if (mag < 3){
				var circle = circle_creator(features, "#FF9999", 3*(1+mag))	
			}

			else if (mag < 4){
				var circle = circle_creator(features, "#FF6666", 4*(1+mag))	
			}

			else if (mag < 5){
				var circle = circle_creator(features, "#FF3333", 5*(1+mag))	
			}

			else if (mag < 6){
				var circle = circle_creator(features, "#FF0000", 6*(1+mag))	
			}

			else if (mag < 7){
				var circle = circle_creator(features, "#CC0000", 7*(1+mag))	
			}

			else if (mag < 8){
				var circle = circle_creator(features, "#990000", 8*(1+mag))	
			}

			else {
				var circle = circle_creator(features, "#660000", 9*(1+mag))	
			}
		 circle.addTo(myMap)

})) 
	
}
);

// var legend = L.control({position: 'bottomright'});
// console.log(legend);
// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         magnitude = ["0-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8+"],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < magnitude.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(magnitude[i]) + '"></i>'
//     }

//     return div;
// };
// function getColor(d) {
//     return d === "0-2" ? '#FFCCCC' :
//            d === "2-3"  ? '#FF9999' :
//            d === "3-4"  ? '#FF6666' :
//            d === "4-5"  ? '#FF3333' :
//            d === "5-6"   ? '#FF0000' :
//            d === "6-7"   ? '#CC0000' :
//            d === "7-8"   ? '#990000' :
//                       '##660000';
// }
// legend.addTo(map);