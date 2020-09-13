/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoieW9nZXNobWlzaHJhNjY3IiwiYSI6ImNrZWppMnRhbjB1ZTAzMHBjempnbjE3dmcifQ.aAvAKk9uR3UBEAs8v9ulxA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/yogeshmishra667/ckeju6wlk3bls19ocl73z63tp',
    // center: [78.8718, 21.7679],
    // zoom: 3.7,
    interactive: false
  });

  //FOR ADD MARKER AND POPUP
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
