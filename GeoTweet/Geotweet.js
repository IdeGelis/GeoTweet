window.onload = init;

var map;
var marker = L.featureGroup();
var trajet = L.featureGroup();
var trace;
var zoom;
var place,country;

function init(){
  map = L.map('mapid').setView([0, 0], 6);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Appel de la fonction goAjax toutes les secondes
  setInterval("goAjax()",1000);
  var form_tweet = document.getElementById("choix_tweet");
  form_tweet.addEventListener("submit",tweet,false);
}

function goAjax() {
  //Création de l'objet xhr
  var ajax = new XMLHttpRequest();
  // destination et type de la requête AJAX (asynchrone ou non)
  //ajax.open("GET","https://api.wheretheiss.at/v1/satellites/25544");
  ajax.open("GET","http://api.open-notify.org/iss-now.json");
  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');// 2eme truc pour permettre que les données envoyé soit encodé comme une donné URL (pour les accents et espace)
  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange', function(e) {
    // si l'état est le numéro 4 (ie revenu) et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      // le texte de la réponse /!\ceci peut s'executer après la suite du code car c'est assynchrone
      res = JSON.parse(ajax.responseText);
      latitude = res.iss_position.latitude;
      longitude = res.iss_position.longitude;
      focus_iss = document.getElementById('Camera_b');
      if (focus_iss.checked){

      }else{
        map.setView([latitude, longitude], 6);
      }
      marker.clearLayers();
      var iss = L.marker([latitude, longitude]);

      iss.addTo(marker);
      map.addLayer(marker);


      //Tracer le trajet
      if (!trace){
        trace = new L.polyline(new L.LatLng(latitude,longitude));
        trace.addLatLng(new L.LatLng(latitude,longitude));
        trace.addTo(map);
      } else{
          if (trace._latlngs[trace._latlngs.length-1].lng>160 && longitude<-160){
            trace = new L.polyline(new L.LatLng(latitude,longitude));
            trace.addLatLng(new L.LatLng(latitude,longitude));
            trace.addTo(map);
          }else{
            trace.addLatLng(new L.LatLng(latitude,longitude))
          }
      }

      document.getElementById('lat').innerHTML = latitude;
      document.getElementById('long').innerHTML = longitude;

    }
  });

  ajax.send();
}

var tweet = function(e) {
  e.preventDefault();
  var img = document.getElementById("img_tweet");
  get_zoom();
  get_location();
  var url = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"
              +String(longitude)
              +","
              +String(latitude)
              +","
              +zoom
              +",0,0/600x600?access_token=pk.eyJ1IjoiaWRlZ2VsaXMiLCJhIjoiY2l6aWh0eTY1MDAxczMzcW5uanNpcWx6cCJ9.sLYzPdNG8a4agQ8aSJw6EQ"
  img.src = url;
}

function get_zoom() {
  var radios = document.getElementsByName('tweet');
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      zoom = radios[i].value;
    }
  }
}

function get_location(){
  var ajax = new XMLHttpRequest();
  // destination et type de la requête AJAX (asynchrone ou non)
  //ajax.open("GET","https://api.wheretheiss.at/v1/satellites/25544");
  ajax.open("GET","http://api.geonames.org/findNearbyPlaceNameJSON?lat="
                    +String(latitude)
                    +"&lng="
                    +String(longitude)
                    +"&username=idegelis");
  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');// 2eme truc pour permettre que les données envoyé soit encodé comme une donné URL (pour les accents et espace)
  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange', function(e) {
    // si l'état est le numéro 4 (ie revenu) et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      // le texte de la réponse /!\ceci peut s'executer après la suite du code car c'est assynchrone
      res = JSON.parse(ajax.responseText);
      if (res.geonames[0]==undefined) {
        document.getElementById('Text_tweet').innerHTML = 'Hello world! :)';
      }else{
        place = res.geonames[0].name;
        country = res.geonames[0].countryName;
        console.log(place,country);
        document.getElementById('Text_tweet').innerHTML = 'Hello '+place+', '+country+'!';
      }
    }
  });
  ajax.send();
}
