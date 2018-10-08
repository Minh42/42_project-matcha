function showLocation(lat, lng) {
	document.getElementById("mapContainer").remove()

			const newDiv = document.createElement('div')
			newDiv.setAttribute("id", "mapContainer")
			const currentDiv = document.getElementById("parentContainer"); 
			currentDiv.parentNode.insertBefore(newDiv, currentDiv);

			const divCreate = document.getElementById('mapContainer')
			divCreate.style.height = "300px"

			var platform = new H.service.Platform({
				'app_id': 'NW3IbPfKVKwkgrLwqzjJ',
				'app_code': '7ZZoQFPP7h15raobMe2NYQ'
				});
			var defaultLayers = platform.createDefaultLayers();		
			var map = new H.Map(document.getElementById('mapContainer'),
						defaultLayers.normal.map,
						{
						center: {lat: lat, lng: lng},
						zoom: 10
						});
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			var ui = H.ui.UI.createDefault(map, defaultLayers);

			var coords = {lat: lat, lng: lng};
			var marker = new H.map.Marker(coords);

			map.addObject(marker);
			map.setCenter(coords);
}

module.exports = {
	showLocation : showLocation
}