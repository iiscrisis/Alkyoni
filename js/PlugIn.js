// JavaScript Document
//Create a plug in page based on the id of the hotel and the template passed in the constructor


function PlugIn(p_id, title, tmpl,menu,db)
{
		this.parent_id = p_id; //The id of the Hotel
		this.rootFilePath=  app.localFilePath+'/'+app.app_dir+'/dir'+p_id+'/';
		this.template = tmpl; //The type of the plugin
		this.$page_div ; //The page containing the plugin
		this.menu = menu;
		
		this.db = db;
		
		this.created = false; //If the plugin has been created do no read DB again
		
		this.context;
		
		this.initialize =function()
		{
		
			this.createPage();
			this.setContext();
			
			//this.render();
		
		}
		
		this.setContext=function()
		{
			//Get context based on the template and the id of the hotel
			var self =this;
			var id = this.template+'_'+self.parent_id; //The unique id of a plug in is created by combining template type and plugins parent id
			
			
			var context;
			
			if(this.template == 'contact_tmpl')
			{
				
				self.db.get(id).then(function (doc) {
					
					context={
					address:doc.address,
					phones:doc.phones,
					email:doc.email,
					hours:doc.hours,
					longitude:doc.longitude,
					latitude:doc.latitude
					
					//[{longtitude:234},{latitude:123.23}]
					
					}
					
					self.context =context;
					
					self.render();
					
					
					
					
					var $par = $("#plugin_"+self.template+'_'+self.parent_id);
					
					var lat = $par.find(".contact_details").data('lat');
					var long = $par.find(".contact_details").data('lon');
					
					var title = "";
					//
					
					var latlong = new google.maps.LatLng(lat ,long);
							
					app.clearMarkers();
					
					app.map.set('center',latlong);
					app.map.set('zoom',16);
							
					//var map = new google.maps.Map(document.getElementById("map_box"),mapOptions);	
							
					$par.find(".map_container").append($("#map_box"));
					
					   var marker = new google.maps.Marker({
						position: new google.maps.LatLng(lat ,long),			
						title:title,
						icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
					});
					
					marker.setMap(app.map);
					
					app.markers.push(marker);
					
					var dist = distance(lat, long, app.lat, app.long);
						
					$par.find(".distance_calc").html("Distance from Your Location is "+dist+"km." );
						
					app.setAppsMarker(app.map);
					
					//app.sendMessage("Geoloc "+app.lat+" "+app.long);
					
					$(".map_container").hide();
						$par.find(".map_container").show();
					
					
										
					
				}).catch(function (err) {});
				
				
			}
			
			if(this.template == 'breakfast_tmpl')
			{
				
				self.db.get(id).then(function (doc) {
					
					
					for(i=0;i<doc.images.length;i++)
					{
						doc.images[i]['icon'] = self.rootFilePath+removeUrl(doc.images[i]['icon']);
						//alert(doc.images[i]['icon'] );	
					}
					context={
						
							menu:doc.menu,
							opening_hours:doc.opening_hours,
							images:doc.images
					}
					
					
					self.context =context;
					
					self.render();
					
					/*if( $("#plugin_"+self.template+'_'+self.parent_id).find(".gallery_thumb").length > 0)
					{
						//alert("found at "+"#plugin_"+self.template+'_'+self.parent_id);
						initialize_gallery_images($("#plugin_"+self.template+'_'+self.parent_id));	
					}else{
							//alert("NOT found at "+"#plugin_"+self.template+'_'+self.parent_id);
					}*/
					
					
				}).catch(function (err) {});
				
				
				
			}
			if(this.template == 'weather_tmpl')
			{
				
				
				//alert("Weather plug in"+id);		
				self.db.get(id).then(function (doc) {
					
					context={
						
							weather:doc.weather
					}
					
					self.context =context;
					
					self.render();
					
				}).catch(function (err) {});
				
				
			}
			
			if(this.template == 'report_tmpl')
			{
				//self.context={parent_id:self.parent_id};
				
				self.db.query('doc_type', {
					key: 'Sent_Msg', 
					include_docs: true,
					attachments: true
				  }).then(function (result) {
					
					
						var messages_array=[];
					
						result.rows.forEach(function(row) {
								
					  		if(row.doc.delete_id==self.parent_id){
								messages_array.push(row.doc);
							}
						});
					
					
			
				
						self.db.get(self.parent_id).then(function (doc) {
						context={
							
								user_name:doc.user_name,
								user_surname:doc.user_surname,
								room_number:doc.room_number,
								parent_id:self.parent_id,
								user_title:doc.user_title	,
								messages:messages_array
						}
						
						self.context =context;
						
						self.render();
						
						
						}).catch(function (err) {}); // En
				}).catch(function (err) {});	
				
				//self.render();
			}
			
			
			if(this.template == 'emergency_tmpl')
			{
				self.db.get(id).then(function (doc) {
					context={
						
							doctor:doc.doctor,
							police:doc.police,
							fire:doc.fire,
							reception:doc.reception,
							additional:doc.additional	
					}
					
					self.context =context;
					
					self.render();
					}).catch(function (err) {});
			}
			
			
			if(this.template == 'favourites_tmpl')
			{
				
				
				var Places_arr=[];

				self.db.allDocs({
				  include_docs: true, 
				  attachments: true,
				  startkey: 'places_'+self.parent_id ,
				  endkey: 'places_'+self.parent_id+'\uffff'
				}).then(function(result) {
					
					counter = 0;
					result.rows.forEach(function(row) {
						counter++;
						var obj={
								title:row.doc.title,
							    id:row.doc.leaf_id,
								longtitude:row.doc.longtitude,
								latitude:row.doc.latitude
							}
						Places_arr.push(obj);
					
					});
					
					if(counter > 0)
					{
						$(".view_location_all").show();	
					}else
					{
						$(".view_location_all").hide();
					}
					
					
					
					context={Place:Places_arr};
					
					self.context =context;
					self.render();
					
				
				  // handle result
				}).catch(function (err) {
				});


			
				
				
			
			
			}
			
			
			if(this.template == 'messages_tmpl')
			{
			
				$(".new_msgs").hide();	
				$(".new_msgs").html("");
				
				
				
				
				self.db.query('doc_type', {
					key: 'pushNote', 
					include_docs: true,
					attachments: true
				  }).then(function (result) {
					
					
						var messages_array=[];
					
						result.rows.forEach(function(row) {
								
					  		if(row.doc.root_id==self.parent_id){
								messages_array.push(row.doc);
							}
						});
						
						context={
							messages:messages_array
						}
						
							self.context =context;
							self.render();
						//self.hoteldata.push(obj);
							
					
					}).catch(function (err) {});	
			}
			
			if(this.template == 'bookmarks_tmpl')
			{
				
		
				
				
				var Bookmarks_arr=[];

				self.db.allDocs({
				  include_docs: true, 
				  attachments: true,
				  startkey: 'bookmark_'+self.parent_id ,
				  endkey: 'bookmark_'+self.parent_id+'\uffff'
				}).then(function(result) {
					
					
					result.rows.forEach(function(row) {
					
						var obj={
								title:row.doc.title,
							    id:row.doc.leaf_id
							}
						Bookmarks_arr.push(obj);
					
					});
					
					
					
					context={Bookmark:Bookmarks_arr};
					
					self.context =context;
					self.render();
					
				  // handle result
				}).catch(function (err) {
				});


			
				
				
			}
			
			//return context;
			
		}
		
		this.render=function()
		{
				
				$("#map_box").appendTo("#repository");
				
				var template = Handlebars.compile($("#"+this.template).html());
				var html = template(this.context);
				this.$page_div.find(".ui-content").html(html);
				setFullScreen();
				
		}
		
		this.createPage = function()
		{
			// if page exists assign it to $page_div
			// use this.tmpl + parent id to ensure that plug in is created only once
			if($("#plugin_"+this.template+'_'+this.parent_id).length > 0)
			{
				this.$page_div = $("#plugin_"+this.template+'_'+this.parent_id);		
			}else
			{
				//create new jquery mobile page based on the template and assign it to $page_div
				this.$page_div = $('<div/>');
				this.$page_div.attr('data-role','page');
				this.$page_div.attr('data-url','one_appy_hotel_plugin');
				this.$page_div.attr('id',"plugin_"+this.template+'_'+this.parent_id);
				this.$page_div.appendTo('body');
			}
			
			
			
			var template = Handlebars.compile($("#page_template").html());
			var context={title:this.title };
			var html = template(context);
			this.$page_div.html(html);
			
				//render menus
			this.$page_div.find(".menu_plugins").html(this.menu.renderPlugIns());
			this.$page_div.find(".menu_topItems").html(this.menu.renderTopItems());
			
			
			//Go to page
			
			
		}
		
		
		this.initialize();
}