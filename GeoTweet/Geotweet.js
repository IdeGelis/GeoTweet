window.onload = init;

var map;
var marker = L.featureGroup();
var trajet = L.featureGroup();
var trace;


function init(){
  map = L.map('mapid').setView([0, 0], 6);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  //Les deux var suivantes vont servir à tracer le trajet sur la carte
  // Appel de la fonction goAjax toutes les secondes
  setInterval("goAjax()",1000);
  var ajax_tweet = new XMLHttpRequest();
  ajax_tweet.add
}

function goAjax() {
  //Création de l'objet xhr
  var ajax = new XMLHttpRequest();
  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open("GET","http://api.open-notify.org/iss-now.json");
  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');// 2eme truc pour permettre que les données envoyé soit encodé comme une donné URL (pour les accents et espace)
  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange', function(e) {
    // si l'état est le numéro 4 (ie revenu) et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      // le texte de la réponse /!\ceci peut s'executer après la suite du code car c'est assynchrone
      //map.removeLayer(marker);
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


      //Tracer le trajet (3 prochaines lignes)
      if (!trace){ //||( trace._latlngs[trace._latlngs.length-1].lng>179 && longitude<-179)  ){
        trace = new L.polyline(new L.LatLng(latitude,longitude));
        trace.addLatLng(new L.LatLng(latitude,longitude));
        trace.addTo(map);
      } else{
        /*
        trace.addLatLng(new L.LatLng(latitude,longitude));
        console.log(trace._latlngs[trace._latlngs.length-1]);
*/

          //console.log(trace);
          if (trace._latlngs[trace._latlngs.length-1].lng>160 && longitude<-160){
            trace = new L.polyline(new L.LatLng(latitude,longitude));
            trace.addLatLng(new L.LatLng(latitude,longitude));
            trace.addTo(map);
          }else{
            trace.addLatLng(new L.LatLng(latitude,longitude))
            //console.log(trace._latlngs[trace._latlngs.length-1].lng);
          }
      }

      document.getElementById('lat').innerHTML = latitude;
      document.getElementById('long').innerHTML = longitude;

    }
  });
  
  ajax.send();
}
