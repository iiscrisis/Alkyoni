// JavaScript Document


function Hotel(u,page_id,hotelDb){

	this.id ; //Id to use in DB
	this.pushnote_id;
	this.hash_url = u;
	this.menu; //Menu Object
	this.subCategories=[]; //List of Leaf categories  no matter how deep in the tree
	this.menuPlugins=[];
	this.menuTopItems=[];
	this.plugIns=[];


	//User specific data
	this.user_name='';
	this.user_surname='';
	this.user_sex='';
	this.user_name='';
	this.vip_pass;
	this.user_id='-1';
	this.user_title;
	this.user_enabled_counter;
	this.room_number='';
	//Filesystem Object
	this.rootFilePath;
	this.RootFileSystem;

	//Current leaf viewed
	this.current_view='';
	//Memory
	this.Memory = hotelDb;

	this.logo ; //Path to Logo
	this.description; //Initial Description
	this.welcome_message;
	this.backgroundType; //Type of Background default fullBackgroundImage, future options gradient, flatcolor, pattern

	this.background; //The data fopr the background, if type is fullBackgroundImage or pattern this is path to image, if gradient the string to cretae the gradient in css, if flat color the HEX of the color.
	this.hotel_data;

	this.page_id = page_id ;

	//Notifications
	this.notes_lifespan = 1; //Number
	this.push_last_receive=0;

	//Initialize Hotel
	this.initialize=function(id){

		var self = this;
		var vars = getUrlVars(this.hash_url.hash);
		this.id = vars['id'];
	

		this.cleanUpPushNotifications();

		//Get initial Data
		this.setContext();


	}

	//Render the data of the hotel including the meni and plug ins

	this.render=function()
	{
		var self = this;

		var template = Handlebars.compile($("#hotel_first_page").html());
		var html  = template(self.hotel_data);

		var $page = $(page_id);
		$page.find(".ui-content").html(html);
		setFullScreen();



		var short_desc	 =$page.find(".main_description").html();

		var endofstr = '...';
		var readmore = 1;
		if(short_desc.length <= MAX_SHORT_DESC)
		{
			endofstr='';
			readmore = 0;
		}
		short_desc = short_desc.substring(0,MAX_SHORT_DESC)+''+endofstr;
		$page.find(".welcome_message").html(short_desc);


		if($page.find(".main_description").hasClass("show_on_first_load") )
		{
			$page.find(".main_description_short").addClass("show_on_first_load");

			//this.$page_div.find(".main_description_short").removeClass("hidden_on_first_load");
		}

		if( readmore==1)
		{

				$page.find(".toolbar_arrow_btn_root ").addClass("show_button_on_first_load");
				$page.find(".toolbar_arrow_btn_root ").removeClass("hidden_button_on_first_load");
		}


		//render menus
		self.menu = new HotelMenu(self.getMenuPlugins(), self.getMenuTopItems(),self.vip_pass,self.logo );


		if(self.vip_pass =='true')
		{
			$("#menu_username").html(self.user_title+' '+self.user_name+' '+self.user_surname);
			$("#menu_room_no").html(self.room_number);

			$("#menu_vip_enabled").html("Signed In");

		}
		//$page.find(".menu_plugins").html(self.menu.renderPlugIns());
		//$page.find(".menu_topItems").html(self.menu.renderTopItems());
		$(".menu_plugins").html(self.menu.renderPlugIns());
		$(".menu_topItems").html(self.menu.renderTopItems());
		$("#side_menu_logo").html("<img src='"+self.logo+"' />");

		if(self.vip_pass == 'true')
		{

			$(".vipEnabled").removeClass("hidden");

			//$(".enableVip").hide();
		}else
		{
			$(".vipEnabled").addClass("hidden");
			$(".enableVip").show();
		}


	}

	this.setContext=function()
	{
		var self = this;
		this.rootFilePath=  app.localFilePath+'/'+app.app_dir+'/dir'+this.id+'/';


		this.Memory.db.get(this.id, function(err, doc) {
		  if (err)
		  {
		  	return err;
		  }
		  // handle doc


		  	doc.logo =self.rootFilePath+removeUrl(doc.logo);
		  	doc.background =self.rootFilePath+removeUrl(doc.background);



		 	 self.hotel_data ={
				logo:doc.logo,
				description:doc.description,
				backgroundType:doc.backgroundType,
				background:doc.background,
				welcome_message:doc.welcome_message
			}

			self.logo = doc.logo;
			self.description = doc.description;
			self.backgroundType = doc.backgroundType;
			self.background = doc.background ;
		    self.menuPlugins = doc.plugIns;
		    self.menuTopItems = doc.MenuTopItems;
			self.vip_pass =doc.vip_pass;
			self.welcome_message=doc.welcome_message;
			self.user_name = doc.user_name;
			self.user_surname = doc.user_surname;
			self.user_sex = doc.user_sex;
			self.vip_pass =doc.vip_pass;
			self.pushnote_id = doc.pushnote_id;
			self.user_title = doc.user_title;
			self.user_id =doc.user_id;
			self.room_number = doc.room_number;

			self.push_last_receive=doc.push_last_receive;


			self.render();

			self.receivePushNotification();
			app.interval_id = setInterval(self.receivePushNotification,600000); //Receive every 10 minutes



			//Receive Weather Data
			var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
			//var encodedData = window.btoa(stringToEncode);
			$.ajax({
					type: 'POST',

					url: ping_host, //Relative or absolute path to response.php file

					success: function(data)
					{
						var ret_t =  jQuery.parseJSON(data);
					//	alert(JSON.stringify(data));//['curtime']);
				//	alert(ret['curtime']);
						var note_date=ret_t['curtime'] ;//Date.now()/1000;

						var stringToEncode =app.appy_uid+"."+note_date;
						var hash = window.btoa(stringToEncode);


						var host='http://www.oneappy.com/api/m.php?m=weather&hotel_id='+self.id+'&hash='+hash;//&pretty=1
						//var host='http://oneappy.interten.gr/api/m.php?m=weather&hotel_id='+self.id;//&pretty=1
						console.log("UID "+app.appy_uid);
							console.log("HASH "+host);
						$.ajax({
						  type: "POST",

						  url: host, //Relative or absolute path to response.php file

						  success: function(data) {
							 ret =  jQuery.parseJSON(data);

							 //alert("Weather :"+ret);
							 self.Memory.db.get('weather_tmpl_'+self.id).then(function(doc)
							 	 {
								 		doc.weather = ret['weather'];
										doc.delete_id = self.id;
										//alert(doc.weather[0]['when']);

										app.HotelDb.db.put(doc).then(function(result) {

											//alert("Weather Success II");

										}).catch(function(){

											//alert("Weather Error II");
											var msg = "Could not Retrieve Weather Data, check connectivity and try again.";

											display_info_message(msg);

										});

								 }).catch(function(){

									ret['_id']='weather_tmpl_'+self.id;
									ret['delete_id']=self.id;

									app.HotelDb.db.put(ret).then(function(result) {



									}).catch(function(){



									});

								});



							},
						  error:function(err)
						  {
							  display_info_message("There seems to be a problem and the weather service is not available at the moment." );
							}
						});//end ajax call to weather


					},
					error: function(err)
					{

					}
			});







		});



		//use this.id to retrieve context as JSON of tyhe first Hotel Page

		//return context;
	}


	//Retrieve which menu items should be displayed
	this.getMenuPlugins=function()
	{


			return this.menuPlugins;
	}


	//Retrieve which menu items should be displayed
	this.getMenuTopItems=function()
	{

			return this.menuTopItems;
	},


	//Create the Leaf of the Hotel
	this.create_subcat= function(u, options)
	{

		var vars = getUrlVars(u.hash);


		// 2 is the id retrieved for the db
		var id = vars['id'];
		var title=vars['title'];

		var hotelLeaf = this.checkIfLeafExists(id);
		//Check if leaf returns boolean meaning false create object
		if(typeof hotelLeaf === 'boolean')
		{
			hotelLeaf = new HotelLeaf(title,id,this.menu,this.id,this.Memory);

			//push hotel to subCategories so as to keep track
			this.subCategories.push(hotelLeaf);
		}
		//else use the object return ed
		this.current_view = hotelLeaf;



		var $page = hotelLeaf.$page_div;
		$page.page();
		$.mobile.changePage( $page, options );


	}

	this.checkIfLeafExists = function(id)
	{
			var hotelLeaf = false;
			for(i=0;i<this.subCategories.length;i++)
			{
				if(	this.subCategories[i].id == id)
				{
					hotelLeaf = this.subCategories[i];
				}
			}

			return hotelLeaf;
	}


	//create plug in based on the type of the plugin
	this.create_plugin = function(u,options)
	{


		var vars = getUrlVars(u.hash);

		var tmpl = vars['template'];
		var title=vars['title'];




		var plugIn = this.checkIfPluginExists(tmpl);
		//Check if leaf returns boolean meaning false create object
		if(typeof plugIn === 'boolean')
		{
			plugIn = new PlugIn(this.id,title,tmpl,this.menu,this.Memory.db);

			//push hotel to subCategories so as to keep track
			this.plugIns[tmpl]=(plugIn);
		}else
		{
				//Since plug ins alter the DB on the client side reread context
				plugIn.setContext();
		}

		//Set plug in page to be as current view
		this.current_view = plugIn;

		var $page = plugIn.$page_div;
		$page.page();
		$.mobile.changePage( $page, options );

	}

	//Go through the plug ins and check if it is already created. If true return the Object otherwise return false

	this.checkIfPluginExists=function(tmpl){

			var plugin = false;
			for(i=0;i<this.plugIns.length;i++)
			{
				if(	this.plugIns[i].template == tmpl)
				{
					plugin = this.plugIns[i];

				}
			}

			return plugin;
	}



	//Add a leaf to bookmarks list or places  list bookmark_type = bookmark Or places
	this.addToBookmarks = function(leafid, bookmark_type)
	{


		var self = this;
		var root_id = this.id; //Get hotels id

		var put_id = bookmark_type[0]+'_'+root_id+'_'+leafid;
		var Leaftitle='';



		this.Memory.db.get(leafid).then(function(doc1){

			//Get title and set leafs bookmark to 1



			Leaftitle = doc1.title;
			if(bookmark_type[0]=='bookmark')
			{
				doc1.bookmark = 'true';
				bookmark_type[1] ='0';
				bookmark_type[2] ='0';

			}else if(bookmark_type[0]=='places')
			{
				doc1.places = 'true';

			}
			//Uodate leaf Db entry set bookmark to true
			 self.Memory.db.put(

				doc1

			 ).catch(function (err) {});

				//Update or Create Bookmark entries

				self.Memory.db.get(put_id).then(function(doc){




					}).catch(function (err) {

					  if (err.status === 404) { // not found!

					  self.Memory.db.put({

							_id: put_id,
							//_rev: doc._rev,
							type:bookmark_type[0],
							title:Leaftitle,
							leaf_id:leafid,
							longtitude:bookmark_type[1],
							latitude:bookmark_type[2],
							delete_id:self.id

						});
		  		 	}
				});




		}).catch(function (err) {

		});

	}

	//Remove a leaf from bookmarks list, if reset_view = true then refresh Bookmarks to reflect the changes
	this.deleteFromBookmarks = function(leafid,reset_view,boomark_type)
	{

		var self = this;
		var root_id = this.id; //Get hotels id

		var put_id = boomark_type+'_'+root_id+'_'+leafid;
		var Leaftitle='';



		this.Memory.db.get(leafid).then(function(doc1){

			//Get title and set leafs bookmark to 1



			Leaftitle = doc1.title;


			if(boomark_type=='bookmark')
			{
				doc1.bookmark = 'false';

			}else if(boomark_type=='places')
			{
				doc1.places = 'false';

				if($(".hotel_leaf").find("#map_box").length < 1)
				{
					$('#repository').append($("#map_box"));
				}
			}

			//Uodate leaf Db entry set bookmark to true
			 self.Memory.db.put(

				doc1

			 ).then(function(response){

				self.Memory.db.get(put_id).then(function(doc)
				{
					self.Memory.db.remove(doc).then(function(doc){

						if(boomark_type =='bookmark')
						{
							self.plugIns['bookmarks_tmpl'].setContext();
						}

						if(boomark_type =='places')
						{
							self.plugIns['favourites_tmpl'].setContext();
						}


						//Update Dom to reflect Bookmark change
						if($("#leaf_"+leafid).length > 0)
						{
							if(boomark_type =='bookmark')
							{
								$("#leaf_"+leafid).find(".bookmark_plugin").attr('checked', false);
							}else if(boomark_type=='places')
							{
								$("#leaf_"+leafid).find(".favourite").removeClass('favourite');

							}
						}

						}).catch(function (err) {});
				});

			}).catch(function (err) {});



		});

	}



	//Receive Notifications from Server & check if there is a status update for the User
	this.receivePushNotification = function()
	{


		if(app.roaming == 'off')
		{
			return 0;
		}



	var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
		$.ajax({
				type: 'POST',

				url: ping_host, //Relative or absolute path to response.php file

				success: function(data)
				{
						var ret_t =  jQuery.parseJSON(data);

					var note_date=ret_t['curtime'] ;//Date.now()/1000;
					var stringToEncode =app.appy_uid+"."+note_date;
					var hash = window.btoa(stringToEncode);

					var self = app.current_hotel;

					//alert(app.current_hotel.id);

					var hotel_id='';
					var user_id='';
					if(app.current_hotel.user_id !='')
					{
						user_id = '&id='+app.current_hotel.pushnote_id;
						hotel_id='';
					}else
					{
						user_id = '';
						hotel_id= '&hotel_id='+app.current_hotel.id;
					}
					//'&timestamp='+this.push_last_receive+
					var offset_time = 1*24*60*60; //Start getting messges that are 1 day old.

					var push_time_stamp = app.current_hotel.push_last_receive - offset_time;

					var host='http://www.oneappy.com/api/m.php?m=pushnotifications'+user_id+hotel_id+'&timestamp='+push_time_stamp+'&hash='+hash;
					//var host='http://www.oneappy.interten.gr/api/m.php?m=pushnotifications'+user_id+hotel_id+'&timestamp='+push_time_stamp;
					console.log(host);
					method='POST';



					 $.ajax({
						type: method,

						url: host, //Relative or absolute path to response.php file

						success: function(data) {
						 ret =  jQuery.parseJSON(data);

						 //alert("msgs");
						// self.checkifVIPenabled(ret['vip_pass']);

								if(ret['vip_pass'] == 'true')
								{
									self.vip_pass = 'true';
									self.checkifVIPenabled(self.vip_pass);
									$(".vipEnabled").removeClass("hidden");
									$(".enableVip").hide();

								}else
								{


								//	alert("Checked in="+ret['vip_pass']);

									self.vip_pass = 'false';
									self.checkifVIPenabled(self.vip_pass);
									$(".vipEnabled").addClass("hidden");
									$(".enableVip").show();
								}

						// alert(JSON.stringify(ret['items']));
						 self.addPushNotifications(ret['items']);


						//alert("Form submitted successfully.\nReturned json: " + data["json"]);
						},
						error:function(err)
						{ //alert("msgs "+err);
						}
					});



				},

				error: function(err)
				{


				}
			});




	}

	this.addPushNotifications = function(notes)
	{

		var counter = 0;
		var self = this;
		//alert("PUSH NOTE ROOT ID ="+self.id);
		self.Memory.db.get(self.id).then(function(doc){


			doc.push_last_receive=Math.floor(Date.now()/1000);

			self.push_last_receive = doc.push_last_receive;

			self.Memory.db.put(doc).then(function()
			{

			}).catch(function()
			{

			});


		}).catch(function(){


		});

		if(notes != null)
		{
			for(i = 0; i< notes.length ; i++)
			{

			notes[i]['delete_id'] = self.id ;
			notes[i]['timestamp'] = Date.now();

		/*	self.Memory.db.get(notes[i]['_id']).then(function(){
					console.log("Note Already Received");
			}).catch(function()
			{*/
				self.Memory.db.put(notes[i]).then(function()
				{

						counter++;
						$(".new_msgs").html(counter);
						if(counter>0)
						{
							$(".new_msgs").show();
						}
					}).catch(function(){

				});


			}
		}


	}

	//Delete Push Notifications older than notes_lifespan
	this.cleanUpPushNotifications = function()
	{
			var self=this;

			if (!Date.now) {
				Date.now = function() { return new Date().getTime(); }
			}

			var lifespan_ms = this.notes_lifespan*86400000;
			var last_message = Date.now() -  lifespan_ms;



			//Remove all that are older than lifespan_ms
				self.Memory.db.query('doc_type', {
					key: 'pushNote',
					include_docs: true,
					attachments: false
				  }).then(function (result) {


						var messages_array=[];

						result.rows.forEach(function(row) {
					  		if(row.doc.timestamp < last_message){
									self.Memory.db.remove(row.doc._id,row.doc._rev)
							}
						});




					}).catch(function (err) {

					});




	}


	//checks if VIP is enabled  and acts accordingly to mirror status on DB
	this.checkifVIPenabled = function(vipenabled)
	{

		var self = this;
			if(vipenabled == 'true') //if it is enabled
			{



				self.Memory.db.get(self.id).then(function(doc) //check if DB is upatodate
				{
					if(doc.vip_pass == vipenabled)
					{
					}else					//If it is not query for enabling
					{
						self.enableVip(false);
					}

				}).catch(function()
				{});
			}else //if it is NOT enabled
			{

				self.Memory.db.get(self.id).then(function(doc)
				{
					if(doc.vip_pass == 'true') //check if DB is upatodate
					{
						self.vip_pass = vipenabled;
						self.menu.vipEnabled=vipenabled;
						doc.vip_pass = vipenabled;
						doc.user_id='';

						//rerender menu

						$(".vipEnabled").addClass("hidden");
						$("#menu_username").html("");
						$("#menu_room_no").html("");

						$("#menu_vip_enabled").html("");
						$(".enableVip").show();

						$(".menu_plugins").html(self.menu.renderPlugIns());

						self.Memory.db.put(doc);
					}else
					{

					}

				}).catch(function()
				{});
			}
	}

	//Enable vip by scanning special qr code
	this.enableVip = function(qr_flag)
	{

		if(app.roaming == 'off')
		{
			var msg = "Network traffic is disabled for one Appy. Enable from the top bar in order to be able to check in";
			display_info_message(msg);
			return 0;
		}


		var self = this;

		if(qr_flag)
		{


			cordova.plugins.barcodeScanner.scan(
				function (result) {
				//	alert("We got a barcode\n" +  "Result: " + result.text + "\n" +	  "Format: " + result.format + "\n" +	  "Cancelled: " + result.cancelled);
					//alert("Ready to Enable "+result.text);
					if( result.cancelled == 0)
					{
						self.enable_vip_actions(result.text);
					}
				})

//alert(1);
				//	self.enable_vip_actions("G182");
		}else
		{
			self.enable_vip_actions(self.id);
		}

		//self.enable_vip_actions('G2');

	}


	this.enable_vip_actions = function(g_id)
	{
//alert(2);

		//alert("Enabling "+g_id);

		var self = this;
		//var host='http://oneappy.interten.gr/api/m.php?m=guestactivate&id='+g_id;
			var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
		$.ajax({
				type: 'POST',

				url: ping_host, //Relative or absolute path to response.php file

				success: function(data)
				{


				//	alert(3);
					var ret_t =  jQuery.parseJSON(data);

					var note_date=ret_t['curtime'] ;//Date.now()/1000;
					var stringToEncode =app.appy_uid+"."+note_date;
					var hash = window.btoa(stringToEncode);



					var host='http://www.oneappy.com/api/m.php?m=guestactivate&hash='+hash+'&id='+g_id;
					method='post';

					 $.ajax({
					  type:method,

					  url: host, //Relative or absolute path to response.php file

					  success: function(data) {

						ret =  jQuery.parseJSON(data);

						if(ret['vip_pass']=='true' && ret['_id']==self.id)
						{
							//update

							self.user_name = ret['user_name'];
							self.user_surname = ret['user_surname'];
							self.user_sex = ret['user_sex'];
							self.vip_pass = ret['vip_pass'];
							self.user_title = ret['user_title'];
							self.user_id = ret['user_id'];
							self.room_number=ret['room_number'];
							self.menu.vipEnabled='true';

							self.pushnote_id = ret['pushnote_id'];


							if(self.vip_pass == 'true')
							{

									$(".vipEnabled").removeClass("hidden");
									$("#menu_username").html(self.user_title+' '+self.user_name+' '+self.user_surname);
									$("#menu_room_no").html(self.room_number);

									$("#menu_vip_enabled").html("Signed In");
										$(".enableVip").hide();



							}else
							{

									$(".vipEnabled").addClass("hidden");

									$("#menu_username").html("");
									$("#menu_room_no").html("");

									$("#menu_vip_enabled").html("") ;
								}


							self.Memory.db.get(self.id).then(function(doc) {

							//	doc._rev= doc._rev,
								doc.user_name=self.user_name;
								doc.user_surname=self.user_surname;
								doc.user_sex = self.user_sex;
								doc.user_enabled_counter = self.user_enabled_counter;
								doc.vip_pass = self.vip_pass;
								doc.user_title = self.user_title;
								doc.user_id=self.user_id;
								doc.room_number = self.room_number;
								doc.pushnote_id=self.pushnote_id ;
								//self.menu.renderPlugIns();

								//Update all active Menus
								$(".menu_plugins").html(self.menu.renderPlugIns());

								self.receivePushNotification();

							  return self.Memory.db.put(doc);
							}).then(function(response) {
							  // handle response
							}).catch(function (err) {

							});



						}else
						{


						}
						//alert("Form submitted successfully.\nReturned json: " + data["json"]);
					  },
					  error:function(err)
					  {
						  var msg = "There appears to be a problem with the network, please try again once you are connected to the Internet";
						 display_info_message(msg);
						}
					});


				},

				error: function(err)
				{


				}
			});





	}
	/*
	this.showNotifications = function(){

		var self = this;

		self.Memory.db.query('doc_type', {
					key: 'pushNote',
					include_docs: true,
					attachments: true
				  }).then(function (result) {

					console.log("returning rows");

						var messages_array=[];

						result.rows.forEach(function(row) {
					  		if(row.doc.root_id==self.id){
								console.log("result : "+row.doc.title);
								messages_array.push(row.doc);
							}
						});

						context={
							messages:messages_array
						}


						//self.hoteldata.push(obj);


					});



	}*/



	this.initialize();
};
