
window.onload=function() { 
	initializeMap();
};


var map, bounds, latlng;
function initializeMap() {
	bounds = new google.maps.LatLngBounds();
	latlng = new google.maps.LatLng(0,0);	
	var stylez = [
		{
			featureType: "all",
			elementType: "all",
			stylers: [
				{ saturation: -100 }
			]
		}
	];
	var mapOptions = {
		zoom: 10,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true,
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	var newMapType = new google.maps.StyledMapType(stylez);//, styledMapOptions);
	map.mapTypes.set('blackandwhite', newMapType);
	map.setMapTypeId('blackandwhite');
	// addMarker(<?= $item->getAttr('latitude') ?>, <?= $item->getAttr('longitude') ?>, '/local/images/map_marker.png', 'Innergo Systems');

	var $p = $(".placemark");
	var latitude = $p.data("latitude");
	var longitude = $p.data("longitude");
	addMarker(latitude, longitude);

}

function addMarker(lat, longitude) {
	var location = new google.maps.LatLng(lat, longitude);
	var marker;
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: '/local/img/gm_placemark.png'
	});
	bounds.extend(location);
	
	map.fitBounds(bounds);
	var listener = google.maps.event.addListener(map, "idle", function() { 
 		if (map.getZoom() > 16) map.setZoom(16); 
 			google.maps.event.removeListener(listener); 
	});
}


$(document).ready(function() {
	var backURL = $("#contact").data("backurl");

	// MAIN BACKGROUND CLICK
	$("#main").click(function(e) {
		var t = $(e.target);
		if (t.attr("id") == "main") {
			window.location.href = backURL;
		}
	});

});

