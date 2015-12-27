function appMaps(template_id,map_container,id)
{

  this.id = id;

  this.container=$("<div/>");
  this.template_id = template_id;
  this.appData;
  this.map;
  this.long;
  this.lat;
  this.map_container = map_container;
  this.googleMapsLoaded=false; //Set to true if googlemaps have been loaded
  this.map_initialized=0;

  this.params;

  this.interval_id;

  this.initialize = function()
  {
    var self = this;
    this.checkforgooglemaps();
    this.interval_id =  setInterval(function(){self.geolocate(self )},6000);
    this.mapsinitialized();
  }


  this.geolocate = function(self )
  {


       console.log("Checking for geoloc : "+self.map_initialized)

      if(self.map_initialized != 1)
      {
          return 0;

      }

      clearTimeout(self.interval_id);

    	navigator.geolocation.getCurrentPosition(app.getGeoLocation,app.geoLocationError);
  }

  this.mapsinitialized = function()
  {


    this.container.addClass("app_page");

  //	alert("1");//$("#front_page_app").html());
    this.template = Handlebars.compile($("#"+this.template_id).html());
    //Should Add a clean up of al nodes begore rerendering
    this.setContext();
    //console.log(this.appData);


  }


  this.setContext = function()
  {
    //Read database and fill context

      var self = this;
      //alert(app.localFilePath);

      //Create Design Doc for Type Query

    //  self.appData.length = 0;
      this.appData={};

      this.render();

}; //End Set context

this.render = function()
{

  var context = {App:this.appData};
  var html = this.template(context) ;
  this.container.attr("id","plugin_"+this.id);
  this.container.html(html);

  this.container.append($("#"+this.map_container));

  return this;

};


   // dom ready


  this.checkforgooglemaps = function()
  {


    if (window.google && google.maps) {
        // Map script is already loaded
        console.log("Map script is already loaded. Initialising");
        this.initializeMap();
    } else {
        console.log("Lazy loading Google map...");
        this.lazyLoadGoogleMap();
    }

  }



   this.createMap = function (params)
   {
      var self = this;

       var myLatlng = new google.maps.LatLng(37.975618, 23.735045);
       var mapOptions = {
           center: myLatlng,
           zoom: 17,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       };
       self.map = new google.maps.Map(document.getElementById(self.map_container), mapOptions);
       var marker = new google.maps.Marker({
           position: myLatlng,
           map: self.map,
           title: "Athens Downtown"
       });

       this.map_initialized = 1;
   }

   this.lazyLoadGoogleMap =function()
   {
      var self = this;

       $.getScript("http://maps.google.com/maps/api/js?sensor=true")
       .done(function (script, textStatus) {
           console.log("Google map script loaded successfully");
           self.initializeMap();
       })
       .fail(function (jqxhr, settings, ex) {
           alert("Could not load Google Maps, please check your internet connection");
       });
   }

  this.initializeMap = function()
  {
     this.createMap(this.params);
  }






  this.setAppPosition=function(latitude, longitude)
  {
    var self = this;
    self.lat = latitude;
    self.long = longitude;

    console.log(latitude+","+ longitude);
    var appPosition = new google.maps.LatLng(self.lat, self.long);

    var marker = new google.maps.Marker({
        position: appPosition,
        map: self.map,
        title: "H τοποθεσία σου"
    });

    self.map.setCenter(appPosition);
  }






  this.setAppsMarker=function(map)
  {

    if(this.long !='' && this.lat !='' && this.geolocation=='on' && this.system_geolocation=='on')
    {
      //console.log("setting app marker at "+this.lat+" = "+this.long);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat ,this.long),
        title:"Your Location"
      });



      marker.setMap(map);

      app.markers.push(marker);
    }else
    {
      //console.log("Marker not set");
    }
  };

this.initialize();
}
