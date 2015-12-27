/**
* Function to fire when everything has loaded
*/

function onLoad()
{

	$("#graph_box").width($(window).width());
	$("#graph_box").height($(window).height());

	document.addEventListener("deviceready", onDeviceReady, false);



}


function onDeviceReady() {

    //Initialize App
		app.initialize();

//Αdd kid action



}



app={
		current_object:"",
		occupied_ids:[],
		occupied_indexes:0,

		homeview:'',
		geolocation:'on',
		system_geolocation :'off',
		//Memory Object oneAppyMemory
		appDb:'',
		map:'',
		markers:[],
		version:1, //Current Version of one appy. It is used so as to receive the correct plugins
		appy_uid:'',
		options:'',
		app_dir:'alkyoni',
		directory_created:'false',
		current_install_assets:0,
		localFilePath :'',
		cancel_installation_flag:false,
	  current_install_step:0,
		interval_id:-10,
		//selected language set
		current_lang:'English',
		host:'localhost',
		map_created:0,


    //kids
    kids_array:[],

		initialize:function()
		{


	    var self = this;//Create Reference
      //Init Db
			this.appDb =this.getDb();
      this.appDb.populateDb();

			//Get Folder Path
			var a = new DirManager(); // Initialize a Folder manager
			a.get_home_path(app.set_home_path);


      //Create HomeView
      app.homeview = new HomeView(app.appDb);

      app.setPage(app.homeview.container);


      this.initChangePage();


			$("#map_box").width($(window).width());
			$("#map_box").height($(window).height());

		$("#app_pages").on('click',".home_btn",function(){

			app.setPage(app.homeview.container);

		});



		},

	 getGeoLocation:function(position)
		{

			//sendMessage("Geoloc");

				var self = this;

				app.map.setAppPosition(position.coords.latitude, position.coords.longitude);

	},

		geoLocationError:function(error)
		{
			//this.sendMessage("Error "+error.code+"\n"+error.message+'\n');
			alert("Geoloc error");


		},



    initChangePage:function(){

      $(document).bind("pagebeforechange", function(e,data)
      {
          //Move map_box back to repository
          $("#map_box").appendTo("#repository");


          //Take care of bindings so as to direct to the correct page
          if ( typeof data.toPage === "string" ) {

            // We are being asked to load a page by URL, but we only
            // want to handle URLs that request the data for a specific
            // category.
            var u = $.mobile.path.parseUrl( data.toPage );

            leaf= /^#vieLeaf/;
            viewKid= /^#kid/;
            viewsub = /^#hotelItem/;
            viewplugin = /^#plugin/;


            ////console.log(u.search);

            if ( u.hash.search(leaf) !== -1 ) {



              app.createAppLeaf( u, data.options );

              e.preventDefault();
            }else if ( u.hash.search(viewKid) !== -1 ) {



								app.createAppKid( u, data.options );

	              e.preventDefault();

            }else if ( u.hash.search(viewplugin) !== -1 ) {


              //Close Menu


              // We're being asked to display the items for a specific category.
              // Call our internal method that builds the content for the category
              // on the fly based on our in-memory category data structure.
              app.create_plugin(u, data.options );


              // create_hotel();

              // Make sure to tell changePage() we've handled this call so it doesn't
              // have to do anything.




              e.preventDefault();
            }else if(u.hash.search(viewmain) !== -1)
            {
              /*if(app.current_hotel.current_view !='')
              {
                $("#"+app.current_hotel.current_view.$page_div.find(".collapsible_menu").attr('id')).trigger('collapse');
              }*/
                 //alert("Go to Main");

                app.gotoRootMain();




                e.preventDefault();
            }



          }



      });


    }
,

    /**
    * takes care of page swap
    */

    setPage :function(page_container)
    {
			alert("Container "+page_container.attr('id'));
      $("#app_pages").find(".app_page").appendTo("#repository");
      $("#app_pages").append(page_container);

			window.scrollTo(0,0);
			ert("setPage DONE" );
    },

    /**
    * Set local path
    */
		set_home_path :function(nativeURL)
		{

		    app.localFilePath = nativeURL;
			//	app.homeview = new HomeView(app.appDb);


		},

		setCurrentView:function(hotel)
		{
			this.current_object = hotel;
		},

		clean_up:function()
		{
			$("#map_box").appendTo("#repository");
			$("#graph_box").appendTo("#repository");



		},


	  getObjectbyId:function(h_id)
		{
			var ret = 0;
			for (var i = 0; i <  this.occupied_ids.length; i++) {
				 if(this.occupied_ids[i].id == h_id)
				 {
					 console.log("Object exists with id "+this.occupied_ids[i].id );
					 	return this.occupied_ids[i];

				 }

				 return ret;
			}

		},

		 createAppKid:function(u, options)
 		{

 			this.clearLeafs();


       var vars = getUrlVars(u.hash);
       var h_id = vars['id'];
       var template_id=vars['template_id'];

       console.log(h_id+ " t_id = "+template_id);

			 if($("#kid_"+h_id).length < 1)
			 {



				 //alert("New kid");
				 var appLeaf = new AppKid(app.appDb,template_id,h_id);
				 this.occupied_ids[this.occupied_indexes] = appLeaf;

				 this.setCurrentView(appLeaf);
				 app.setPage(appLeaf.container);
				 this.occupied_indexes++;

			 }else {
			//	 alert("New exists");
			 		 this.setCurrentView(this.getObjectbyId(h_id));
			 		 app.setPage($("#kid_"+h_id));


			 }


 		},

		createAppLeaf:function(u, options)
		{

			this.clearLeafs();


      var vars = getUrlVars(u.hash);
      var h_id = vars['id'];
      var template_id=vars['template_id'];

      console.log(h_id+ " t_id = "+template_id);

			if($("#Leaf_"+h_id).length < 1)
			{
				var appLeaf = new AppLeaf(app.appDb,template_id,h_id);

				this.occupied_ids[this.occupied_indexes] = appLeaf;

				this.setCurrentView(appLeaf);
				app.setPage(appLeaf.container);

				this.occupied_indexes++;
			}else {

				this.setCurrentView(this.getObjectbyId(h_id));
				app.setPage($("#Leaf_"+h_id));

			}





		},



		              // We're being asked to display the items for a specific category.
		              // Call our internal method that builds the content for the category
		              // on the fly based on our in-memory category data structure.
		create_plugin:function(u, options )
		{
			this.clearLeafs();


			var vars = getUrlVars(u.hash);
			var h_id = vars['id'];
			var template_id=vars['template_id'];
			var plugin_type = vars['plugin_type'];

			console.log(h_id+ " t_id = "+template_id);
			var appPlugin;
			if($("#plugin_map_plugin").length < 1)
			{
				if(plugin_type == 'map' && this.map_created==0)
				{
					this.map = new appMaps(template_id,"map_box", "map_plugin");
				 	appPlugin=	this.map ;
					this.map_created=1;
				}
			}else {
				$("#map_box").appendTo(this.map.container);
			}

		// new AppLeaf(app.appDb,template_id,h_id);
			this.setCurrentView(this.map);
			app.setPage(this.map.container);


		},


		gotoRootMain:function()
		{
			var $page = $("#one_appy_hotel_main");
			$page.page();
			$.mobile.changePage( $page, options );
		},


		getDb:function()
		{
			var db = new AppMemory('alkyoni');
			return 	db;
		},


		//Delete Pages from previously viewed Hotels
		clearLeafs:function()
		{
			//console.log("clearing Pages");
			$(".LeafPage").remove();
		},

		sendMessage:function(str)
		{
			if (navigator.notification) {
          	  navigator.notification.alert(str);
			} else {
				alert(str);
			}
		},



		clearMarkers:function()
		{
				for(i=0;i<app.markers.length;i++)
				{
					app.markers[i].setMap(null);
				}
		}




};
