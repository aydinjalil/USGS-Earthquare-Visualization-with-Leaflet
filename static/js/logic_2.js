var coords = [37.0902, -95.7129];
var mapZoomLevel = 4;
var earthquakes = new L.LayerGroup();
var boundaries = new L.LayerGroup();
// Create the createMap function

// var myMap;


// Create the tile layer that will be the background of our map
function create_map(data){
	earthquakes = data[0];
	borders = data[1];

	var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  maxZoom: 18,
	  id: "mapbox.satellite",
	  accessToken: API_KEY
	});

	var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  maxZoom: 18,
	  id: "mapbox.light",
	  accessToken: API_KEY
	})

	var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  maxZoom: 18,
	  id: "mapbox.outdoors",
	  accessToken: API_KEY
	})
	var baseMaps = {
	    "Satellite": satellite,
	    "Grayscale": grayscale,
	    "Outdoors": outdoors
  };

 	var overlayMaps = {
    	"Fault Lines": borders,
    	"Earthquakes": earthquakes
  	};

  	var myMap = L.map("map", {
    center: coords,
    zoom: mapZoomLevel,
    layers: [satellite, earthquakes]
  });

	L.control.layers(baseMaps, overlayMaps, {
    	collapsed: false
  	}).addTo(myMap);
	
	legend_creation(myMap);
}

// var markers
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";



function circle_creator (features, fill, _rad){
	circles = L.shapeMarker([features.geometry.coordinates[1], features.geometry.coordinates[0]], {
				fillColor: fill,
				fillOpacity: 1,
				color: "black",
				weight: 1,
				shape: "circle",
				radius: _rad
		}).bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>" + 
      "<hr><p>" + "Richter Magnitude: " + features.properties.mag + "</p>");
	 return circles;
} 

function layer_creator(){

	// Request the API for earthquake data
	d3.json(url, function(error, response){
	
	if (error) throw error;
	// console.log(response);
	response.features.forEach((features=>{
		var mag = features.properties.mag;

		var coords = [features.geometry.coordinates[1], features.geometry.coordinates[0]]

		if (coords)
			if (mag < 1){
				var circle = circle_creator(features, "#45ff2f", 2*(1+mag))	
			}

			else if (mag < 2){
				var circle = circle_creator(features, "#adff2f", 3*(1+mag))	
			}

			else if (mag < 3){
				var circle = circle_creator(features, "#ffe92f", 4*(1+mag))	
			}

			else if (mag < 4){
				var circle = circle_creator(features, "#ffa062", 5*(1+mag))	
			}

			else if (mag < 5){
				var circle = circle_creator(features, "#ff9049", 6*(1+mag))	
			}
			else{
				var circle = circle_creator(features, "#ff2f45", 7*(1+mag))	
			}
		circle.addTo(earthquakes)
	
		})) 
	});

	// Read donwload json data containing data of Earthquake Fault Lines
	d3.json("../data/static/PB2002_boundaries.json", function(error, data){
		if (error) throw error;
		var plates = L.geoJSON(data, {
			color: "red", 
			weight: 2
		}).addTo(boundaries)


		// data.features.forEach((feature)=>{
		// 	lat_long.push(feature.geometry.coordinates);
			
		// });
		create_map([earthquakes, boundaries]);
	})
	// console.log(lat_long);
	
	// var polyline = L.polyline(polylinePoints)
}




layer_creator();

// Creating color based legend that shows the magnitude of the earthquakes
function legend_creation(myMap){
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function () {
	    var div = L.DomUtil.create('div', 'legend');
	    // var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
	    var labels = []
	    var grades = [0, 1, 2, 3, 4, 5];
	    var categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
	    var colors = ["#45ff2f", "#adff2f", "#ffe92f", "#ffa062", "#ff9049", "#ff2f45"]
	    div.innerHTML += '<strong>Richter Magnitude<strong><br>';
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + categories[i]+ '<br>';
	        // div.innerHTML += '<i style="background:' + getValue(grades[i]) + '"></i> ' + grades[i] + '&ndash;' + grades[i + 1] + '<br>';
	    }

	    return div;
	};
	legend.addTo(myMap);
}
