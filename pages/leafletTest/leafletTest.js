Page({
  data: {
    
  },
  onLoad: function() {
    var map = L.map('leaflet_wrapper', {
      zoomControl: false,
      attributionControl: false
    }).setView([34.19817309627726, 108.96240234375], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoieXVhbmd1b3hpbiIsImEiOiJjanJuajRhZDcwdGFvNGFuM3hkZ3Bvdmw2In0.en61n78nLTcEzoR4NFiPpw'
    }).addTo(map);
  }
})