var markers = [];

// Rendering a new map using MapBox library
mapboxgl.accessToken = '<API Key Goes Here>';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.0942, 42.3601],
    zoom: 12
});

async function busTracker(){
  // get bus data    
	const locations = await getBusLocations();
  locations.forEach(location => {
    let busId = location.id;
    let longitude = location.attributes.longitude;
    let latitude = location.attributes.latitude;
    let directionId = location.attributes.direction_id;
    if (markers.hasOwnProperty(busId)) {
      // console.log('Marker Exists');
      moveMarker(directionId, busId, longitude, latitude);
    } else {
      // console.log('Adding Marker');
      addMarker(map, directionId, busId, longitude, latitude);
    }
    
  });
	// timer
	setTimeout(busTracker, 5000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

// Adding new bus markers 
function addMarker(map, direction, bus, longitude, latitude) {
  let el;
  if (direction === 0) {
    el = document.createElement('div');
    el.className = 'marker-blue';
  } else {
    el = document.createElement('div');
    el.className = 'marker-red';
  }
  var marker = new mapboxgl.Marker(el)
    .setLngLat([longitude, latitude])
    .addTo(map)
  markers[bus] = marker;
};

// Updating existing bus markers
function moveMarker(direction, bus, longitude, latitude) {
  let marker = markers[bus];
  let color = markers[bus]._element;
  if (direction === 0) {
    if (color.classList.contains('marker-red')) {
      color.classList.remove('marker-red');
      color.classList.add('marker-blue');
    }
  } else {
    if (color.classList.contains('marker-blue')) {
      color.classList.remove('marker-blue');
      color.classList.add('marker-red');
    }
  }
  marker.setLngLat([longitude, latitude])

};