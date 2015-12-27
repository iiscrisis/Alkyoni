// JavaScript Document

//Language set messages
/*function languages()
{

}

var language_set = Array();

language_set['English']['delete_msg'] = 'Confirm Deletion.';*/

function directory_exists()
{

app.current_hotel.render();
var $page = $("#one_appy_hotel_main");
$page.page();

$.mobile.changePage( $page, app.options ) ;

}

function failed_dir()
{



		retrieve_lost_data(app.current_hotel.id);



}
function 	retrieve_lost_data(id)
{
	$("#loading_page").find(".loader_msg_container").addClass("loader_message");
	var buttons = "<div class='proceed accent_text dl_yes'>YES</div><div class='proceed accent_text dl_no'>NO</div><div class='proceed orange_text dl_skip'>SKIP</div>";
	$("#loading_page").find(".loader_msg_container").html("Some Files (images) are missing & need to be downloaded again.<br/> Proceed?"+buttons);
	$("#loading_page").addClass("loading");
	$("#loading_page").removeClass("loaded");

	//start_install(app.current_hotel.id);
}



function yo()
{
	//alert("yo");
}
function save_message_in_sent(message,parent_id,g_id)
{

	note_date=Date.now();

	var date = new Date(note_date);
	var Day = date.getDate();
	var Month = date.getMonth();
	var Year = date.getFullYear();

	// will display time in 21:00:00 format


	msg_id = parent_id+'_msg_'+note_date;

	note_date = Day+'-'+Month+'-'+Year;

	doc_type = "Sent_Msg";
	var message_short='';

	if(message.length > 60)
	{
		message_short = message.substring(0,50)+'...';
	}else
	{
		message_short = message;
	}

	var context ={

		'_id':msg_id,
		'delete_id':parent_id,
		'doc_type':doc_type,
		'message':message,
		'message_short':message_short,
		'note_date':note_date

	}

	app.HotelDb.db.put(context).then(function()
		{

			var template = Handlebars.compile($("#single_send_message_tmpl").html());
			var html  = template(context);

			$("#outbox").find(".notifications_container").append(html);;
		}
	).catch();




}


function getUrlVars(u)
{

		var pos = u.indexOf("?");
		var values = u.substr(pos+1,u.length);
		//console.log("params = "+values);

		var pars = values.split('&');
		var arr=[]

		for(i=0;i<pars.length;i++)
		{
			var tmp = pars[i].split(':');
			arr[tmp[0]]=tmp[1];
		}

		return arr;

}

function setInstallStep(step,message,root_id)
{
	//Add steps in order to identify which stage of installation appy is currently on
	// 0 = begin
	// 1 = got languages
	// 2 = got data
	// 5 = got pictures
	// 100 = installed new type

//		alert("1637 Step is "+step);

	var cur_step = $("#cancel_install").data('step');
	cur_step =	app.current_install_step;

	if(step==0)
	{
		$("#cancel_install").html();
	}else
	{
		$("#cancel_install").html("Cancel");
	}

	if(step==1)
	{
		$("#cancel_install").data('root',root_id);
	}

	if(step<5 && step>0)
	{
		cur_step+=step;

	}

	if(step == 5)
	{
		if(	cur_step == 3 || cur_step == 103)
		{
			cur_step+=step;
		}
	}

	if(step == 100)
	{
		cur_step+=step;
	}

	if(step ==-100)
	{
		//canceling
		cur_step =0;
	}




	$("#cancel_install").data('step',cur_step);
	app.current_install_step = cur_step;
	//alert("Current Step = "+$("#cancel_install").data('step'));
	$("#loading_page").find(".loader_msg_container").removeClass("loader_message");
	$("#loading_page").find(".loader_msg_container").html(message);
}





function start_install(appy_id,force_update)
{

		var language="eng";

		$("#loading_page").find(".loader_msg_container").addClass("loader_message");
		$("#loading_page").find(".loader_msg_container").html("Downloading new Appy Information. Please Wait.");
		$("#loading_page").addClass("loading");
		$("#loading_page").removeClass("loaded");

	//	host = 'http://oneappy.interten.gr/api/m.php?m=availablelanguages&id='+appy_id+'&t='+Date.now(); //&pretty=1

		//host = 'http://oneappy.interten.gr/available_languages.php'; //&pretty=1
		app.current_install_assets = 0;
		app.current_install_step=0;
			//alert("Languages 0");
		setInstallStep(1,'Retrieving Available Languages',appy_id);

		var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
		//var encodedData = window.btoa(stringToEncode);
		$.ajax({
			type: 'POST',

			url: ping_host, //Relative or absolute path to response.php file

			success: function(data)
			{
				//alert("Languages I");
				var ret_t =  jQuery.parseJSON(data);

				var note_date=ret_t['curtime'] ;//Date.now()/1000;
				var stringToEncode =app.appy_uid+"."+note_date;
				var hash = window.btoa(stringToEncode);

				host = 'http://www.oneappy.com/api/m.php?m=availablelanguages&id='+appy_id+'&hash='+hash+'&t='+Date.now(); //&pretty=1

				$.ajax({
					type: "POST",

					url: host, //Relative or absolute path to response.php file

					success: function(data) {

						ret =  jQuery.parseJSON(data);

						//	alert("Languages II");
						if(ret['languages'].length > 1)
						{
							if(!app.cancel_installation_flag)
							{


								var  html_str = '<h2>Please Select Language</h2>';
								for(i=0;i<ret['languages'].length;i++)
									{
									html_str+='<div class="language_select" data-force_update="'+force_update+'" data-id="'+appy_id+'"data-lang="'+ret['languages'][i]['code']+'">'+ret['languages'][i]['title']+'</div>';
								}

								$("#loading_page").find(".loader_msg_container").removeClass("loader_message");
								$("#loading_page").find(".loader_msg_container").html(html_str);
							}
						}else
						{

							 if(!app.cancel_installation_flag)
							{

									//alert("Languages III - start install");
							install_root(appy_id,ret['languages'][0]['code'],force_update);
							}

						}
					},
				error:function(err)
				{

					alert("Could not Connect to Server, Check Internet Connectivity and try again");
					$("#loading_page").addClass("loaded");
					$("#loading_page").removeClass("loading");

				}
			});



			},

			error: function(err)
			{


			}
		});


}


function install_root(id,language,force_update)
{
		var host = '';


		//host='http://oneappy.interten.gr/api/m.php?m=install&id='+id+'&lng='+language+'&version=1&appy_uid='+app.appy_uid;//[&pretty=1][other params]';
		method='post';

		//	alert("Install I");
		setInstallStep(-1,'Language: '+language+'. Retrieving Appy Data',id);
		var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
		$.ajax({
			type: 'POST',

			url: ping_host, //Relative or absolute path to response.php file

			success: function(data)
			{
				var ret_t =  jQuery.parseJSON(data);
				var note_date=ret_t;//Date.now()/1000;
				var stringToEncode =app.appy_uid+"."+note_date;
				var hash = window.btoa(stringToEncode);


				host='http://www.oneappy.com/api/m.php?m=install&id='+id+'&lng='+language+'&version=1&hash='+hash;//+'&appy_uid='+app.appy_uid;//[&pretty=1][other params]';

				$.ajax({
				type: "POST",

				url: host, //Relative or absolute path to response.php file

				success: function(data) {

				ret =  jQuery.parseJSON(data);
			//	alert(1772);

				 //Check if Root exists
				 app.HotelDb.db.get(ret['assets']['root_id']).then(function(doc){


					//Check if needs Updating
				//	alert(doc.current_lang);
					if(ret['assets']['update_stamp'] == doc.update_stamp && doc.current_lang == language && !force_update)
					{
						$("#loading_page").find(".loader_msg_container").addClass("loader_message");
						$("#loading_page").find(".loader_msg_container").html("Appy Exists & is  up to date.");
				//		alert(1784);
						setTimeout(function(){

								$("#loading_page").removeClass("loading");
								$("#loading_page").addClass("loaded");

						},3000);
					}else
					{


						//Save User details
					//	alert("1793");
				//	alert("force_update "+force_update);
						var user_details_array=Array();

						user_details_array['user_id']=doc.user_id;
						user_details_array['pushnote_id']=doc.pushnote_id;
						user_details_array['vip_pass']=doc.vip_pass;
						user_details_array['user_name']=doc.user_name;
						user_details_array['user_surname']=doc.user_surname;
						user_details_array['user_sex']=doc.user_sex;
						user_details_array['room_number']=doc.room_number;
						user_details_array['user_enabled_counter']=doc.user_enabled_counter;
						user_details_array['user_title']=doc.user_title;
						user_details_array['current_lang']=language;


						$("#loading_page").find(".loader_msg_container").addClass("loader_message");
						$("#loading_page").find(".loader_msg_container").html("Appy Exists but is not updated, please wait!");
						if(!app.cancel_installation_flag)
						{
							update_root(doc,ret,user_details_array);
						}

					}
					}).catch(function(){

					if(!app.cancel_installation_flag)
					{
					//	alert("1822 installing_root");
						install_root_db(ret,force_update);
					}

				}); //App hotel db get




				},
				error:function(err)
				{
					//console.log("Error "+err);
				}
			});



			},

			error: function(err)
			{


			}
		});






}

function update_root(doc,ret,user_details_array)
{

	var self = this;
	//alert("427 : update root");
	console.log()
	for(i=0;i<ret['items'].length;i++)
	{
		if(ret['items'][i]['_id']==doc._id)
		{
				ret['items'][i]['user_id'] = user_details_array['user_id'];
				ret['items'][i]['pushnote_id'] = user_details_array['pushnote_id'];
				ret['items'][i]['user_name'] = user_details_array['user_name'];
				ret['items'][i]['user_surname'] = user_details_array['user_surname'];
				ret['items'][i]['user_sex'] = user_details_array['user_sex'];
				ret['items'][i]['vip_pass'] = user_details_array['vip_pass'];
				ret['items'][i]['user_enabled_counter'] = user_details_array['user_enabled_counter'];
				ret['items'][i]['user_title'] = user_details_array['user_title'];
				ret['items'][i]['current_lang'] =user_details_array['current_lang'];
				ret['items'][i]['room_number'] = user_details_array['room_number']
		}
		update_item(ret['items'][i]);




	}





}

function download_updated_assets(root_dir,assets)
{
//	alert("459 dl updated assets");
	app.current_install_assets = assets.length+1;

	var downloads = new AppyFileSystem(root_dir,assets);
	//sendMessage("Updating "+root_dir);
	downloads.listAssets();
	downloads.downloadAssets(initHomeViewAfterInstall);
}

function update_item(appy_item)
{
		/*	console.log("-----");
			console.log(JSON.stringify(appy_item));*/
			 app.HotelDb.db.get(appy_item['_id']).then(function(doc_update){

				if(appy_item['doc_type']=='Assets')
				{

					var a = new DirManager(); // Initialize a Folder manager
					a.get_home_path(app.set_home_path);

					var semophore = 0;

					 // a.create_r(app.app_dir+'/'+root_dir,after_folder_create_download(root_dir,assets));
					app.directory_created='false';
					var root_dir = 'dir'+appy_item['root_id'];
	 				var assets = appy_item['assets'];
					if(semophore ==0)
						{

							a.create(app.app_dir+'/'+root_dir,function(){

									//alert("dir created");
									var orig = app.directory_created	;
									app.directory_created = 'true';





									app.current_install_assets =  assets.length+1;
								  download_updated_assets(root_dir,assets);


							},function(){

									//alert("dir not created");
										var orig = app.directory_created	;
										app.directory_created = 'error';
										download_updated_assets(root_dir,assets);


							});


						}




				}

				appy_item['_rev']  = doc_update._rev;
				app.HotelDb.db.put(appy_item).then(function(){

				}).catch(function(){});
			}).catch(function(){


				app.HotelDb.db.put(appy_item).then(function(){

				}).catch(function(){});

			});

}



function install_root_db(data)
{

	$("#loading_page").addClass("loading");
	$("#loading_page").removeClass("loaded");
	var self = this;




	if(data['items'][0]['hotel_title'] == null)
	{
			$("#loading_page").find(".loader_msg_container").html("Appy Id is Not Valid.");
			setTimeout(function(){
						$("#loading_page").removeClass("loading");
						$("#loading_page").addClass("loaded");
						$("#loading_page").find(".loader_msg_container").html("");

				},3000);

	}else if(!app.cancel_installation_flag && data['items'][0]['hotel_title'] != null)
	{

		setInstallStep(2,'Installing Appy Data for '+data['items'][0]['hotel_title'],'none');

		app.HotelDb.db.bulkDocs(
			data['items']
		).then(function (result) {
			//console.log("Hotel Created");
			if(!app.cancel_installation_flag)
			{
				var root_dir = 'dir'+data['assets']['root_id'];
				var assets = data['assets']['assets'];
				app.current_install_assets = assets.length+1;



				var a = new DirManager(); // Initialize a Folder manager
				a.get_home_path(app.set_home_path);

				var semophore = 0;

				 // a.create_r(app.app_dir+'/'+root_dir,after_folder_create_download(root_dir,assets));
				 app.directory_created='false';





					var downloads = new AppyFileSystem(root_dir,assets);
					check_for_new_type(data['assets'],downloads);




					if(semophore ==0)
					{

						a.create(app.app_dir+'/'+root_dir,function(){


								var orig = app.directory_created	;
								app.directory_created = 'true';



								after_folder_create_download(root_dir,assets);


						},function(){


									var orig = app.directory_created	;
									app.directory_created = 'error';



						});


					}



			}else
			{
				//Deleteing recently installed db
				delete_db_for_root(data['assets']['root_id'])	;
			}// end if(!app.cancel_installation_flag


		}).catch(function (err) {
			//console.log(err);
		});
	}//end else

}



function after_folder_create_download(root_dir,assets)
{

	 if(!app.cancel_installation_flag)
	 {



		var downloads = new AppyFileSystem(root_dir,assets);

		downloads.listAssets();
		downloads.downloadAssets(initHomeViewAfterInstall);
	}

}

//Check if installed appy is of a new type and a new list must be created
function check_for_new_type(info,downloads)
{

	if(app.cancel_installation_flag)
	{
		return 0;
	}
	var appy_type = info['appy_type'];
	var appy_icon = info['appy_icon'];
	var appy_family = info['appy_family'];

	var appy_type_counter = 0;




	app.HotelDb.db.get('system_one_appy_1').then(function(doc){

		if(!app.cancel_installation_flag)
		{
			for(i=0;i<doc.installed_types.length;i++)
			{
				if(	doc.installed_types[i]['appy_type'] == appy_type)
				{
					appy_type_counter = 1;


					//increment Type counter
					doc.installed_types[i].installed_apps++;

					app.HotelDb.db.put(doc).then(function(){
						setInstallStep(100,'Installing New Appy Type','none');


						;
						if(app.cancel_installation_flag)
						{
							delete_type_for(info['root_id']);
						}
						initHomeViewAfterInstall();

					}).catch(function(){


					});

					//Check if the file has been previously downloaded
					break;
				}
			} //end for

			if(appy_type_counter == 0)
			{
				new_appy_icon = downloads.downloadAppFile(appy_icon,initHomeViewAfterInstall); //Download Appy and

				var new_appy_type={appy_type:appy_type, appy_family:appy_family,icon:new_appy_icon,installed_apps:1};

				doc.installed_types.push(new_appy_type);

				app.HotelDb.db.put(doc).then(function(){

					setInstallStep(100,'Installing New Appy Type','none');

				}).catch(function(){


				});


			}//end if appy_type_counter

		}// end if(!app.cancel_installation_flag)



	}
	).catch(function(){



	});
}


function initHomeViewAfterInstall()
{

	if(app.cancel_installation_flag)
	{
		app.current_install_assets = 0;
		return 0;
	}


	app.current_install_assets--;
//		alert('2129 	app.current_install_assets='+	app.current_install_assets)

	var msg = "Downloading Files. "+app.current_install_assets+" left to complete";
	setInstallStep(5,msg,'none');



	//$("#loading_page").find(".loader_msg_container").html(msg);
	//decrement isntall assets counter


	if(app.current_install_assets == 0)
	{
		app.homeview.initialize();
			setInstallStep(0,"Appy has finished downloading.",'none');
	//$("#loading_page").find(".loader_msg_container").html();
		setTimeout(function(){
						$("#loading_page").removeClass("loading");
						$("#loading_page").addClass("loaded");
						$("#loading_page").find(".loader_msg_container").html("");

				},3000);
	}
}


function delete_db_for_root(root_id)
{


		app.HotelDb.db.query('delete_id', {
				key: root_id,
				include_docs: true,
				attachments: true
				}).then(function (result) {


					items_deleted_counter = 0;

					result.rows.forEach(function(row) {

							delete_item(row.doc,root_id,result.rows.length);
					});



			}).catch(function(error){

			});;
}

function delete_folders_for(root_id)
{
	 var a = new DirManager();
	 // app.localFilePath+'/'+
	var delete_folder =app.app_dir+'/dir'+root_id;
	a.remove(delete_folder,Log, Log);
}

function delete_type_for(root_id)
{
		app.HotelDb.db.get(root_id).then(function(doc){

		var doc_type = doc.doc_type;

		app.HotelDb.db.get('system_one_appy_1').then(function(doc){

				for(i=0;i<doc.installed_types.length;i++)
				{
					if(doc.installed_types[i]['appy_type']==doc_type)
					{
						doc.installed_types[i]['installed_apps']--;
						break;
					}
				}

				app.HotelDb.db.put(doc).then().catch();

		});

	}).catch(function(){});
}

function checkRoaming(clicked,show_message)
{

	var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
	//var encodedData = window.btoa(stringToEncode);
	$.ajax({
		type: 'POST',

		url: ping_host, //Relative or absolute path to response.php file

		success: function(data)
			{

						app.roaming='on';
						if(	$(".roamingEnabled").hasClass("disabled") || clicked)
						{
							var msg = "Your phone is connected to a network. One Appy may use resources from the internet. Charges from your provider may apply. ";
							$(".roamingEnabled").removeClass("disabled");
							if(show_message)
							{
								display_info_message(msg);
							}


						}else{


						}




		},

		error:function()
			{
			//	alert("2");
					app.roaming='off';


					if(!$(".roamingEnabled").hasClass("disabled")|| clicked)
					{
							var msg = "Your phone is not connected to a network. Certain services will not work.";
							$(".roamingEnabled").addClass("disabled");

							if(show_message)
							{
								display_info_message(msg);
							}

					}

			}
	});
}


	function show_root_loader($button,msg)
	{
			$button.closest(".front_details").find(".appy_loader_text").html(msg);
			$button.closest(".front_details").find(".appy_loader").show();

	}


	function hide_root_loader($button)
	{
			$button.closest(".front_details").find(".appy_loader_text").html("");
			$button.closest(".front_details").find(".appy_loader").hide();
	}

	function enable_geolocation(position)
	{


		var msg='';
		msg = "Location Services are Active on your device";
		display_info_message(msg);

		app.getGeoLocation(position); //Set geolocation
		/*app.HotelDb.db.get(	'system_one_appy_1').then(function(doc){

				doc.geolocation = 'on';
				app.geolocation='on';

				app.HotelDb.db.put(doc).then(function(){}).catch(function(){});

					$(".geolocEnabled").removeClass("disabled");
					var msg='';

					if(app.system_geolocation == 'on')
					{
						msg = "Geolocation is allowed, and Location Services are Active on your device";
					}else
					{
						msg = "Geolocation is allowed, but Location Services are Not Active on your device. Location services will not be available through the app until they are turned on on the system";
					}
					display_info_message(msg);

				});*/
	}

	function geolocation_disabled(error)
	{
			app.geoLocationError(error);
		//	$(".geolocEnabled").addClass("disabled");

			msg = "Location Services are Not Active on your device. Location services will not be available through the app until they are enabled.";

			display_info_message(msg);


	}


function resize_img($img)
{


	$img.load(function(){


		$(this).data('width',this.naturalWidth);
		var natW = this.naturalWidth;
		$(this).data('height',this.naturalHeight);
		var natH = this.naturalHeight;

		var w_x = $(window).width();
		var w_y = $(window).height();

		var p_x =0;
		var p_y = 0;



		var ratio_x_y;
		if(p_y < w_y)
		{
			ratio_x_y	= w_x/w_y;
		}else
		{
			ratio_x_y	= w_x/p_y;
		}





		var ratio_img_x_y = natH/natW ;

		var new_x = $(window).width();
		var new_y = new_x * ratio_img_x_y;



			if(new_y < $(window).height())
			{
				var new_h_ratio = $(window).height()/new_y;
				new_y = new_y*new_h_ratio;
				new_x = new_x*new_h_ratio;
			}
		var offset_x = (new_x-$(window).width())/2;
		if(offset_x < 0)
		{
			offset_x = 0;
		}else
		{
			offset_x = offset_x*-1;
		}


		$img.css("width",new_x);
		$img.css("height",new_y);
		$img.css("position","relative");
		$img.css("left",offset_x);

	});

}

function setFullScreen()
{
	//alert("setFullScreen");
					var w = $(window).width();
					var h =  $(window).height();
					$(".fullscreen_mode").css("min-width",w+"px");
					$(".fullscreen_mode").css("min-height",h+"px");


					$(".fullscreen_mode").map(function(){

							if($(this).find("img.bg_image").length > 0)
							{

								 resize_img($(this).find("img.bg_image"));

							}

					});

					$(".map_container").css("height",h+"px");
						$("#map_box").css("height",h+"px");


}

var items_deleted_counter = 0;

function initialize_gallery_images(self)
{

			var nw = Math.ceil($(window).width()*0.32);


			$(".image_gallery").css("min-height",$(window).height()+'px');
			$(".image_gallery").css("min-width",$(window).width()+'px');

			self.find(".gallery_thumb").css('width',nw+'px');
			self.find(".gallery_thumb").css('height',nw+'px');

			self.find(".gallery_thumb").map(function(){

				$(this).find("img").load(function() {

					var new_h = this.naturalHeigh;
					var new_w = this.naturalWidth;

					var ratio = this.naturalWidth/this.naturalHeight;

					if(this.naturalWidth >= this.naturalHeight)
					{

							new_w = Math.ceil(nw * ratio);
							new_h = nw;

					}else {

						new_w = nw;
						new_h =  Math.ceil(nw/ratio);

					}

					$(this).css('width',new_w+'px');
					$(this).css('height',new_h+'px');



						var offset_x = ((new_w - nw)/2)*-1;

						$(this).css('position','relative');
						$(this).css('left',offset_x+'px');

					$(this).data('width',this.naturalWidth);
					$(this).data('height',this.naturalHeight);

				});
			});

}
//Create Binder for page change so as to create pages dynamicaly
function initialize_map_for_view(self)
{


			if(self.hasClass("open_map"))
			{
					self.closest(".places_actions_buttons").siblings(".map_container").hide();
					self.closest(".places_actions_buttons").siblings(".distance_calc").html("")
					self.removeClass("open_map");
			}else
			{


				var lat = self.closest(".single_place").data('lat');
				var long = self.closest(".single_place").data('long');
				var title = self.closest(".single_place").data('title');
				//


				var latlong = new google.maps.LatLng(lat ,long);

				app.clearMarkers();

				app.map.set('center',latlong);
				app.map.set('zoom',16);

				app.map.setMapTypeId(google.maps.MapTypeId.ROADMAP );
				//var map = new google.maps.Map(document.getElementById("map_box"),mapOptions);

				self.closest(".places_actions_buttons").siblings(".map_container").append($("#map_box"));

				   var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat ,long),
					title:title,
					icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
				});

				marker.setMap(app.map);

				app.markers.push(marker);


				self.closest(".places_actions_buttons").siblings(".distance_calc").html("");
				if(app.geolocation=='on' && app.system_geolocation =='on')
				{

					var dist = distance(lat, long, app.lat, app.long);

					self.closest(".places_actions_buttons").siblings(".distance_calc").html("Distance from Your Location is "+dist+"km." );
					app.setAppsMarker(app.map);

				}
				/*var dist = 0;
				self.closest(".places_actions_buttons").siblings(".distance_calc").html("Distance from Your Location is "+dist+"km." );*/
				//app.sendMessage("Geoloc "+app.lat+" "+app.long);

				$(".map_container").hide();
				self.closest(".places_actions_buttons").siblings(".map_container").show();

				self.addClass("open_map");
			}

}

function initialize_maps()
{
	 // //alert('loaded script');
	 if (typeof google === 'object' && typeof google.maps === 'object') {


			navigator.geolocation.getCurrentPosition(app.getGeoLocation,app.geoLocationError);
			app.googleMapsLoaded = true;
		}else
		{


		}

}

function loadScript(src,id) {



 if (typeof google === 'object' && typeof google.maps === 'object') {


								initialize_maps();
					}else
					{




		  var script = document.createElement('script');
		  script.type = 'text/javascript';
		  script.src = src;
		  script.id=id;
		  document.body.appendChild(script);

	}
}
function delete_item(appy_item,id,items_to_delete)
	{
			if(appy_item.delete_id==id){
								app.HotelDb.db.get(appy_item._id).then(function(doc)
								{




									app.HotelDb.db.remove(appy_item._id,doc._rev).then(function(){


									items_deleted_counter++;
									if(items_deleted_counter >= items_to_delete)
									{
											$('#appies_list').empty();
											$('#my_appies').empty();
											$('#appies_list').hide();
											app.homeview.initialize();
									}

								}).catch(function(){
								});;

								});


							}
	}

function display_info_message(str)
{
		$("#info_text").html(str);
		$("#info_box").addClass("opened");
		setTimeout(function() {$("#info_text").html("");
		$("#info_box").removeClass("opened");}, 5000);
}


function distance(lat1, lon1, lat2, lon2) {

		var unit ="K"

	    var radlat1 = Math.PI * lat1/180

	    var radlat2 = Math.PI * lat2/180

	    var radlon1 = Math.PI * lon1/180

	    var radlon2 = Math.PI * lon2/180

	    var theta = lon1-lon2

	    var radtheta = Math.PI * theta/180

	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

	    dist = Math.acos(dist)

	    dist = dist * 180/Math.PI

	    dist = dist * 60 * 1.1515

	    if (unit=="K") { dist = dist * 1.609344 }

	    if (unit=="N") { dist = dist * 0.8684 }

	    return dist

	}

	function clear_pushnotes_interval()
	{
		if(app.interval_id != -10)
		{
			clearInterval(app.interval_id);
			app.interval_id = -10;
		}
	}



	function leaf_messagin($info_box, message)
	{
		$info_box.html('');
		/*$info_box.removeClass('hideLeafMessage');
		$info_box.addClass('showLeafMessage');*/
		$info_box.html(message);
		//$info_box.addClass('showLeafMessage');
		/*$info_box.addClass('hideLeafMessage');*/
		$info_box.show();

		$info_box.fadeOut(3000, function () {
			 $(this).hide();
		});

	}

	function fileSystemSuccess()
	{
		//alert("Success");
	}

	function fileSystemFail()
	{
		//alert("fileSystemFail");
	}
function onLoad()
{
	//alert("fire");



	document.addEventListener("deviceready", onDeviceReady, false);



}

//Events to fire after device ready has Fired
//document.addEventListener("resume", yourCallbackFunction, false);

//document.addEventListener("pause", yourCallbackFunction, false);


//document.addEventListener("backbutton", yourCallbackFunction, false);

//document.addEventListener("menubutton", yourCallbackFunction, false);
//document.addEventListener("searchbutton", yourCallbackFunction, false); //ANDROID



//$(document).ready(function(){
function onDeviceReady() {

		//alert("device is ready");

		//set background
		var bg_num = Math.floor(Math.random()*9);
		$("#one_appy_main").addClass("appy_bg_"+bg_num);

		var w = $(window).width();
		var h =  $(window).height();
		$(".fullscreen_mode").css("min-width",w+"px");
		$(".fullscreen_mode").css("min-height",h+"px");


		var tl_init = new TimelineMax({paused:true});
		tl_init.staggerTo($(".tween_intro"),1,{opacity:1},0.3);
		tl_init.play();
		app.initialize();
		navigator.geolocation.getCurrentPosition(app.getGeoLocation,app.geoLocationError);


	//Geolocation on/off
	$("#flip-3").slider();
	$("#flip-4").slider();
	/*
	$( ".selector" ).bind( "change", function(event, ui) {

	});*/



	$(document).on('click','.dl_yes',function(){

		start_install(app.current_hotel.id,true);
	});

	$(document).on('click','.dl_no',function(){

		$("#loading_page").find(".loader_msg_container").removeClass("loader_message");

		$("#loading_page").find(".loader_msg_container").html("");
		$("#loading_page").removeClass("loading");
		$("#loading_page").addClass("loaded");
	});

	$(document).on('click','.dl_skip',function(){

		directory_exists();

		$("#loading_page").find(".loader_msg_container").removeClass("loader_message");

		$("#loading_page").find(".loader_msg_container").html("");
		$("#loading_page").removeClass("loading");
		$("#loading_page").addClass("loaded");
	});




	$(document).on('click','.hotel_actions ',function()
	{

		/*$("#loading_page").find(".loader_msg_container").addClass("loader_message");
		$("#loading_page").find(".loader_msg_container").html("Loading Appy...");

		$("#loading_page").addClass("loading");
		$("#loading_page").removeClass("loaded");	*/

	});



	$(document).on('click','.vipEnabled ',function()
	{
		var msg = "You Are checked in";
		display_info_message(msg);
	});




	//asas
	$(document).on('click','.roamingEnabled ',function()
	{

		checkRoaming(true,true);


	/*	if($(this).hasClass("disabled"))
		{
			//alert("roam2");
			if(app.googleMapsLoaded == 'false')
			{
				loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDY4mWiTwof0gYR1K7GlZ6NwX-ToIkKf0E&sensor=false&callback=initialize_maps','google_map');
			}

			app.HotelDb.db.get('system_one_appy_1').then(function(doc){

				doc.roaming = 'on';
				app.roaming='on';

				app.HotelDb.db.put(doc).then(function(){}).catch(function(){});

				$(".roamingEnabled").removeClass("disabled");
				var msg = "Internet traffic is enabled. One Appy may use resources from the internet. Charges from your provider may apply. ";


				display_info_message(msg);

			});
		}else
		{
				app.HotelDb.db.get('system_one_appy_1').then(function(doc){

				doc.roaming = 'off';
				app.roaming='off';
				app.HotelDb.db.put(doc).then(function(){}).catch(function(){});

				$(".roamingEnabled").addClass("disabled");

				var msg = "Internet traffic is disabled";

				display_info_message(msg);
			});
		}*/



	});




	$(document).on('click','.geolocEnabled ',function()
	{
		//alert("geo1");

		var msg = "Checking if Location Services are enabled in your phone, this might take a few seconds.";
		display_info_message(msg);

	/*	navigator.geolocation.getCurrentPosition(enable_geolocation,geolocation_disabled);*/

			loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDY4mWiTwof0gYR1K7GlZ6NwX-ToIkKf0E&sensor=false&callback=initialize_maps','google_map');


	/*	if($(this).hasClass("disabled"))
		{
			//alert("geo2");
			//If geolocation is of

				var msg = "Checking if Location Services are enabled in your phone, this might take a few seconds.";
				display_info_message(msg);

				navigator.geolocation.getCurrentPosition(enable_geolocation,geolocation_disabled);

		}else
		{
				app.HotelDb.db.get('system_one_appy_1').then(function(doc){

				doc.geolocation = 'off';
				app.geolocation='off';
				app.HotelDb.db.put(doc).then(function(){}).catch(function(){});

				$(".geolocEnabled").addClass("disabled");

				var msg = "Geolocation is disabled for one appy.";
				display_info_message(msg);
			});
		}*/


	});

	 //s

	$(document).on('click','.close_info_btn',function()
	{
		$("#info_box").removeClass("opened");
	});

	$(document).on('click','#menu_options',function()
	{
		$(this).toggleClass("clicked");
		setTimeout(function(){

			$("#menu_options").removeClass("clicked");

		},7000);
	});


	$(document).on('click','.places_options',function()
	{

		if($(this).closest('.single_place').hasClass('show_places_options'))
		{
			$('.show_places_options').removeClass('show_places_options');
		}else
		{
			$('.show_places_options').removeClass('show_places_options');
				$(this).closest('.single_place').addClass('show_places_options');
		}

		$(".tapped").removeClass("tapped");


	});

	$(document).on('focus','.report_text',function() {

        if (this.value === this.defaultValue) {
            this.value = '';
        }
  });
  $(document).on('blur','.report_text',function() {
        if (this.value === '') {
            this.value = this.defaultValue;
        }
	});

	$(document).on('click','.gallery_plugin',function(){

			var $par = $(this).closest(".hotel_leaf");
			//$par.find(".image_gallery").toggleClass("closed");

			$par.toggleClass("open_gallery");
			$(this).toggleClass("clicked");


	});


	$(document).on('click','.close_gallery_btn',function(){

			var $par = $(this).closest(".hotel_leaf");

			$par.removeClass("open_gallery");
			$par.find(".gallery_plugin").removeClass("clicked");

	});

	$(document).on('click','.gallery_thumb',function(){


			var $par = $(this).closest(".hotel_leaf");
			var img_array = Array();
			var items =Array();
			$par.find(".image_gallery_src").find(".gallery_thumb").map(function(){



					var $img = $(this).find("img");

					var width=  $img.naturalWidth;
					var height =  $img.naturalHeight;

					var item_pic = {
								src: $img.data('src'),
								w: $img.data('width'),
								h: $img.data('height')
						}


				items.push(item_pic);


			});
		/*	if(!$par.find(".image_gallery_slider").hasClass("loaded"))
			{
						var win_width = $(window).width();
						var win_height = $(window).height()-116;

						$par.find(".image_gallery_slider").css('width',win_width+'px');
						$par.find(".image_gallery_slider").css('height',win_height+'px');

						$par.find(".image_gallery_slider").empty();

						for(i=0;i<item.length;i++)
						{
							var index_img;
							if(i==0)
							{
								index_img = 'first';

							}else if(i==item.length-1)
							{
								index_img = 'last';

							}else {
								index_img = 'between';
							}
							var offset_x = i*win_width;
							var css = "style='position:absolute;left:"+offset_x+";'";
							var img_src='<img class="image_gallery_single_image" data-index='+index_img+' '+css+' src="'+$img.data('src')+'"/>';

							$par.find(".image_gallery_slider").append(img_src);

						}

						$par.find(".image_gallery_slider").addClass("loaded");
				}*/

			var pswpElement = document.querySelectorAll('.pswp')[0];

			var index = $(this).index();
			// define options (if needed)
			var options = {
				// optionName: 'option value'
				// for example:
				index: index // start at first slide
			};

			// Initializes and opens PhotoSwipe
			var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();

		});



/*
		$(document).on('swipeleft','.image_gallery_single_image',function()
		{
			var index_img = $(this).data('index');
			if(index_img!='last')
			{


			}

		});


		$(document).on('swiperight','.image_gallery_single_image',function()
		{});*/

	$(document).on('click','.toolbar_arrow_btn',function(){


		var $par = $(this).closest(".hotel_leaf");
		$par.find(".main_description").toggleClass("closed");

		$par.find(".toolbar_tools_btn").removeClass("clicked");
		$par.find(".leaf_plugins").removeClass("clicked");

		$par.find(".toolbar_subcategories_btn").removeClass("clicked");
		$par.find(".subcategories").removeClass("clicked");

		if($(this).hasClass("rot"))
		{
			$(this).removeClass("rot");


			$(".main_description_short").show();

		}else
		{
				$(this).addClass("rot");
				$(".main_description_short").hide();
		}


	});


	$(document).on('click','.toolbar_arrow_btn_root',function(){


		var $par = $(this).closest("#hotel_main");
		$par.find(".main_description").toggleClass("closed");

		/*$par.find(".toolbar_tools_btn").removeClass("clicked");
		$par.find(".leaf_plugins").removeClass("clicked");

		$par.find(".toolbar_subcategories_btn").removeClass("clicked");
		$par.find(".subcategories").removeClass("clicked");*/

		if($(this).hasClass("rot"))
		{
			$(this).removeClass("rot");
			$(".welcome_message").show();
		}else
		{
				$(this).addClass("rot");
				$(".welcome_message").hide();
		}


	});




$(document).on('click','.close_terms_btn',function(){
	window.history.back();
});

	$(document).on('click','.close_back_btn',function(){
		window.history.back();
	});

	$(document).on('click','.toolbar_tools_btn',function()
	{


	/*	$par.find(".toolbar_subcategories_btn").removeClass("clicked");
		$par.find(".subcategories").removeClass("clicked");*/

		$(this).toggleClass("open");
		$(this).parent(".leaf_toolbar").siblings(".leaf_plugins").toggleClass("clicked");
	});


	$(document).on('click','.toolbar_subcategories_btn',function()
	{
		/*$par.find(".toolbar_tools_btn").removeClass("clicked");
		$par.find(".leaf_plugins").removeClass("clicked");*/

		$(this).closest(".hotel_leaf").find(".distance_calc").html("");
		$(this).closest(".hotel_leaf").find(".view_leaf_map").removeClass("clicked");
		$(".map_container").hide();


		$(this).toggleClass("clicked");
		$(this).parent(".leaf_toolbar").siblings(".subcategories").toggleClass("clicked");
	});

	$(document).on('click','.main_message_title',function(){


			$(".open_options").addClass("close_open_options");
			$(".open_options").removeClass("open_options");
			$(".msg_toolbar").addClass("hidden");

		if($(this).closest(".push_notification_entry").hasClass("open_msg")) //If its open close
		{
			$(this).closest(".push_notification_entry").addClass("close_open_msg");
			$(this).closest(".push_notification_entry").removeClass("open_msg");

				$(this).closest(".push_notification_entry").removeClass("base_light");

		}else // Else close open and open this one
		{
			$(".open_msg").addClass("close_open_msg");
			$(".open_msg").removeClass("base_light");
			$(".open_msg").removeClass("open_msg");


			$(this).closest(".push_notification_entry").addClass("open_msg");
			$(this).closest(".push_notification_entry").addClass("base_light");



		}

	});


	$(document).on('click','.message_options',function(){


		if($(this).hasClass("open_options")) //If its open close
		{
			$(this).addClass("close_open_options");
			$(this).removeClass("open_options");

			$(this).closest(".message_top").siblings(".msg_toolbar").addClass("hidden");

		}else // Else close open and open this one
		{

			$(".open_options").addClass("close_open_options");
			$(".open_options").removeClass("open_options");
			$(this).addClass("open_options");
			$(".msg_toolbar").addClass("hidden");

			$(this).closest(".message_top").siblings(".msg_toolbar").removeClass("hidden");




		}

	});

	//Delete msg

	$(document).on('click','.delete_msg',function(){


		var confirmation = getConfirmation("Deleting");//slanguage_set[app.c]['delete_msg']);

		if(confirmation == true)
		{
			var msg_id = $(this).data("msg_id");

			var self = $(this).closest(".push_notification_entry");
			app.HotelDb.db.get(msg_id).then(function(doc){

				app.HotelDb.db.remove(msg_id,doc._rev).then(function(){


					self.remove();

				}).catch(function(){



				});


		});

		}



	});



	$(document).on('click','.star_msg',function(){


		var msg_id = $(this).data("msg_id");

			var self = $(this);
			app.HotelDb.db.get(msg_id).then(function(doc){



				if(self.hasClass("starred"))
				{
					 doc.starred = '';
				}else
				{
					doc.starred = 'starred';
				}


				app.HotelDb.db.put(doc).then(function(){


					if(self.hasClass("starred"))
					{
						self.parent(".msg_toolbar").siblings(".message_top").find(".star_msg").removeClass("starred");
						self.removeClass("starred");
					}else
					{
						self.addClass("starred");
						self.parent(".msg_toolbar").siblings(".message_top").find(".star_msg").addClass("starred");
					}




				}).catch(function(){



				});


			});





	});


	$(document).on('click','.view_starred',function(){

			if($(this).hasClass("starview"))
			{
					$(this).removeClass("starview");

				$(".push_notification_entry").removeClass("hidden");
			}else
			{
				$(this).addClass("starview");

				$(".push_notification_entry").each(function() {

					if(!$(this).find(".star_msg").hasClass("starred"))
					{
						$(this).addClass("hidden");
					}
				});
			}


	});
		//Update Root
	$(document).on('click','.update_root',function(){

		app.cancel_installation_flag=false;

		var id = $(this).data('root_id');
		start_install(id,false);

	});



	//Cance; install
	$(document).on('click','#cancel_install',function()
	{

		// steps in order to identify which stage of installation appy is currently on
		// 0 = begin
		// 1 = got languages
		// 2 = got data
		// 5 = got pictures
		// 100 = installed new type

		var step=$(this).data('step');
		step =app.current_install_step;
		var root_id=$(this).data('root');


		app.cancel_installation_flag=true;
		setInstallStep(-100,"Cancelling installation of Appy.",root_id);

		if(step>1)
		{
			if(step == 3)
			{
				delete_db_for_root(root_id);
			}else if(step == 8)
			{

				 delete_folders_for(root_id);
			}else if(step == 103)
			{

				delete_type_for(root_id);
				delete_db_for_root(root_id);
			}else if(step == 108)
			{

				delete_db_for_root(root_id);

				delete_folders_for(root_id);

				delete_type_for(root_id);
			}

		}

		setTimeout(function(){
							$("#loading_page").removeClass("loading");
							$("#loading_page").addClass("loaded");
							$("#loading_page").find(".loader_msg_container").html("");

					},3000);


	});

	$(document).on('click','.delete_root',function(){

		show_root_loader($(this),'Deleting, Please wait');


		var confirmation = getConfirmation("Are You Sure You want to delete this Appy?")

		if(confirmation == false)
		{
			hide_root_loader($(this));
			return 0;
		}

		var id = $(this).data('root_id');


		app.HotelDb.db.get(id).then(function(doc){

			var doc_type = doc.doc_type;

			app.HotelDb.db.get('system_one_appy_1').then(function(doc){

					for(i=0;i<doc.installed_types.length;i++)
					{
						if(doc.installed_types[i]['appy_type']==doc_type)
						{
							doc.installed_types[i]['installed_apps']--;
							break;
						}
					}

					app.HotelDb.db.put(doc).then().catch();

			});

		}).catch(function(){});

		//Delete Assets

		 var a = new DirManager();
		 // app.localFilePath+'/'+
		var delete_folder =app.app_dir+'/dir'+id;
		a.remove(delete_folder,Log, Log);



		app.HotelDb.db.query('delete_id', {
					key: id,
					include_docs: true,
					attachments: true
				  }).then(function (result) {


						items_deleted_counter = 0;

						result.rows.forEach(function(row) {

					  		delete_item(row.doc,id,result.rows.length);
						});



		});




	});


	//Send a message

	$(document).on('click','.send_message',function()
	{

		if(app.current_hotel.vip_pass == 'true')
		{
			g_id = app.current_hotel.pushnote_id;

			var parent_id = $("#report_content").find(".parent_id_form").val();

			var message =  $(this).closest(".user_details").siblings(".report_content").find(".report_text").val();


			var ping_host ='http://www.oneappy.com/api/m.php?m=servertime';
			//var encodedData = window.btoa(stringToEncode);
			$.ajax({
				type: 'POST',

				url: ping_host, //Relative or absolute path to response.php file

				success: function(data)
				{
					var ret_t =  jQuery.parseJSON(data);

					var note_date=ret_t['curtime'] ;//Date.now()/1000;
					var stringToEncode =app.appy_uid+"."+note_date;
					var hash = window.btoa(stringToEncode);


						var host =	 'http://www.oneappy.com/api/m.php?m=sendmessage&id='+g_id+'&message='+message+'&hash='+hash;
					//	 'http://oneappy.interten.gr/api/m.php?m=sendmessage&id='+g_id+'&message='+message;
						//console.log("HASH "+host);
						$.ajax({
						  type: method,

						  url: host, //Relative or absolute path to response.php file

						  success: function(data)
						  	{

									var ret = jQuery.parseJSON(data);

								if(ret['error']['id']=='4111')
								{
									app.current_hotel.checkifVIPenabled(false);
									var msg = "You have been checked out. You can no longer send messages. Thank You.";
									$("#report").find(".report_text").val("");
									display_info_message(msg);
								}else {

									var msg = "Your Message has been sent, thank you";
									$("#report").find(".report_text").val("");
									display_info_message(msg);

									save_message_in_sent(message,parent_id,g_id); //g_id is the actual user id in the remote database

								}


							},

						  error:function(err)
					  		{
						  		var msg = "An error occured while trying to send your message, check connectivity and please try again";
									display_info_message(msg);
								}
							});
						},
						error:function()
						{
							//	alert("2");
						}
					});
		}


	});






	//init homeview on click event
	$(document).on('click','.enableVip',function()
	{
		app.current_hotel.enableVip(true);

	});


	$(document).on('click','.view_location',function()
	{
		var self = $(this);






		if(app.roaming == 'on')
		{
			self.closest(".places_actions_buttons").siblings(".distance_calc").html("Loading Map please wait" );
			 $.ajax({
				  type: "POST",

				  url: app.host+'/ping.php', //Check that internet is on
				  success: function(data) {


				//if(app.

				if(app.googleMapsLoaded == 'false')
				{
					loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDY4mWiTwof0gYR1K7GlZ6NwX-ToIkKf0E&sensor=false&callback=initialize_maps','google_map');
				}
			//Func

			initialize_map_for_view(self);



		},//End ajax success
		error:function(err)
		{
					 var msg = "Access to network may be down, Maps could not be loaded, check connectivity and retry.";
				display_info_message(msg);
		}
		});


		}else
		{
				var msg = "internet traffic is disabled, enable to be able to view maps";
				display_info_message(msg);
		}

	});

	$(document).on('click','.view_location_all',function()
	{


		var self = $(this);



		if(app.roaming == 'on')
		{

			self.closest(".places_actions_buttons").siblings(".distance_calc").html("Loading Map please wait" );
			 $.ajax({
				  type: "POST",

				  url: app.host+'/ping.php', //Check that internet is on
				  success: function(data) {

							var lat;
							var long ;
							var title ;

						var markers_array= Array();
						var counter =0;

						app.clearMarkers();
						if(self.hasClass("open_map"))
						{
								self.siblings(".map_container").hide();
								self.removeClass("open_map");
						}else
						{
								self.closest(".places_list").find(".single_place").each(function()
								{
										 lat = $(this).data('lat');
										 long = $(this).data('long');
										 title = $(this).data('title');
										 var arr = Array();
										 arr[0] = lat;
										 arr[1] = long;
										 arr[2] = title;
										 markers_array[counter] = arr;

										 counter++;
								});

								if(counter > 0)
								{

										var latlong = new google.maps.LatLng(markers_array[0][0] ,markers_array[0][1]);

									/*	var mapOptions=
										{
											center:latlong,
											zoom:16,
											mapTypeId:google.maps.MapTypeId.ROADMAP
										};*/

										app.map.set('center',latlong);
										app.map.setMapTypeId(google.maps.MapTypeId.ROADMAP );
									//	app.sendMessage("View All maps");

										//var map = new google.maps.Map(document.getElementById("map_box"),mapOptions);
										self.siblings(".map_container").append($("#map_box"));

										var markers= Array();

										for(i=0;i<markers_array.length;i++)
										{
												var marker = new google.maps.Marker({
													position: new google.maps.LatLng(markers_array[i][0]  ,markers_array[i][1] ),
													title:markers_array[i][2],
													icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
												});

											marker.setMap(app.map);
											app.markers.push(marker);
										}


									self.closest(".places_actions_buttons").siblings(".distance_calc").html("");
									if(app.geolocation=='on' && app.system_geolocation =='on')
									{
										app.setAppsMarker(app.map);
									}



									$(".map_container").hide();
									self.siblings(".map_container").show();
									self.addClass("open_map");

								}
							}
						//navigator.geolocation.getCurrentPosition(app.getGeoLocation,app.geoLocationError);

						},//End ajax success
						error:function(err)
						{
									 var msg = "Access to network may be down, Maps could not be loaded, check connectivity and retry.";
								display_info_message(msg);
						}
			});
		}else
		{
				var msg = "internet traffic is disabled, enable to be able to view maps";
				display_info_message(msg);
		}//end if



	});




	$(document).on('click','.view_leaf_map',function()
	{

		var self = $(this);


		if(app.roaming == 'on')
		{

				self.closest(".places_actions_buttons").siblings(".distance_calc").html("Loading Map please wait" );
			 $.ajax({
				  type: "POST",

				  url: app.host+'/ping.php', //Check that internet is on
				  success: function(data) {



				},//End ajax success
		error:function(err)
		{
			var msg = "Access to network may be down, Maps could not be loaded, check connectivity and retry.";
			display_info_message(msg);
		}
		});

			if(self.hasClass("clicked"))
			{

				self.parent('.leaf_plugins').siblings(".map_container").hide();
				self.parent('.leaf_plugins').siblings(".distance_calc").html("")
				self.removeClass("clicked");

			}else
			{

				var lat = self.data('lat');
				var long = self.data('long');
				var title = self.data('title');
				//


				if (typeof google === 'object' && typeof google.maps === 'object') {


						var latlong = new google.maps.LatLng(lat ,long);

				app.clearMarkers();

				app.map.set('center',latlong);
				app.map.set('zoom',16);
				app.map.setMapTypeId(google.maps.MapTypeId.ROADMAP );

				//var map = new google.maps.Map(document.getElementById("map_box"),mapOptions);

				self.parent('.leaf_plugins').siblings(".map_container").append($("#map_box"));

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat ,long),
					title:title,
					icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
				});

				marker.setMap(app.map);

				app.markers.push(marker);

				self.closest(".places_actions_buttons").siblings(".distance_calc").html("");

				if(app.geolocation=='on' && app.system_geolocation =='on')
				{
					var dist = distance(lat, long, app.lat, app.long);

					self.parent('.leaf_plugins').siblings(".distance_calc").html("Distance from Your Location is "+dist+"km." );

					app.setAppsMarker(app.map);
				}


				$(".map_container").hide();
				self.parent('.leaf_plugins').siblings(".map_container").show();

				self.addClass("clicked");

				}else
				{

					var msg = "There appears to be some network problems, could not load Maps.";
					display_info_message(msg);
				}

			}//End else

		}else
		{
				var msg = "internet traffic is disabled, enable to be able to view maps";
				display_info_message(msg);
		}//end if
	});



	//Register If Boolean Helper

	Handlebars.registerHelper("ifBool", function(conditional, options) {
	  if (conditional === 'true') {
		return options.fn(this);

	  } else {
		//console.log("Is False");
		return options.inverse(this);
	  }
	});


	$(document).on('click','.root_btn',function()
	{


			if($(this).siblings(".front_details").hasClass("hidden"))
			{
				$(".front_details").addClass("hidden");
				$(".root_btn").removeClass("accent_text");
				$(".root_btn").removeClass("black");

				$(this).siblings(".front_details").removeClass("hidden");
				$(this).addClass("accent_text");
				$(this).addClass("black");

			}else
			{

					$(".front_details").addClass("hidden");
					$(".root_btn").removeClass("accent_text");
					$(".root_btn").removeClass("black");
			}
	});



	$(document).on('click','.my_appies_header',function()
	{


		var cnt_pos = $("#my_appies_container").data('top');
		var height = ($("#my_appies").height()+ 10);


		if($(this).hasClass("open_list"))
		{
			$("#my_appies_container").css('top',cnt_pos+'px');
			$(this).removeClass("open_list");
		}else
		{
			$(this).addClass("open_list");
			if(height > cnt_pos)
			{
				height = 0;
			}else
			{
				height =cnt_pos-  height ;
			}
			$("#my_appies_container").css('top',height+'px');
		}


	});



	$(document).on('swiperight','.LeafPage',function(){
		window.history.back();
	});

		$(document).on('swipeleft','.ui-page',function(){
		window.history.forward();
	});


	$(document).on('tap','.my_appy_type', function(e){
		$(".tapped").removeClass('tapped');
			$(this).addClass('tapped');


		var cnt_pos = $("#my_appies_container").data('top');
			$("#my_appies_container").css('top',cnt_pos+'px');
			$(this).removeClass("open_list");

			clear_pushnotes_interval();

			var typeappies_cnt = $(this).data('typeappies');

			if($(this).find("img").hasClass("img_loaded"))
			{
				var img_src=$(this).find("img").attr('src');
				//alert(2);
			}else
			{//alert(3);
				if($("#"+typeappies_cnt).find(".no_load").length < 1)
				{//alert(4);
					var $no_load = $(this).find(".no_load").clone();
					$no_load.removeClass("text-body");
					$no_load.addClass("text-headline");
					$no_load.addClass("text-center");
					$no_load.addClass("dark_on_light");

					//$no_load.prepend("My Appy ");
					//alert(5);
					$no_load.prependTo($("#"+typeappies_cnt));
					$("#"+typeappies_cnt).find('.my_hotels_logo').hide();
				}
			}
			//alert(6);
			$(".appy_type_list").hide();
			$("#"+typeappies_cnt).show();
			$("#appies_list").show();
			$(".my_appy_type").removeClass("tapped");

			//Delete all divs created before
			$(".LeafPage").remove();
			//alert(7);


	});

	$(document).on('click','.close_root',function()
	{

			$("#appies_list").hide();



	});

	$(document).on('click','.language_select',function()
	{
		var lang = $(this).data('lang');
		var id=$(this).data('id');
		var force_update = $(this).data('force_update');



		$("#loading_page").find(".loader_msg_container").addClass("loader_message");
		$("#loading_page").find(".loader_msg_container").html("Receiving Appy Data, please wait!");

		install_root(id,lang,force_update);
	});
	//install Root Event
	$(document).on('click','#scan_qr_btn',function()
	{

		clear_pushnotes_interval();
		app.cancel_installation_flag = false;

			var result="";
		cordova.plugins.barcodeScanner.scan(
    			function (result) {


					if(result.cancelled == 0)
					{
						start_install(result.text,false);
					}
				},
				function (error) {
					app.sendMessage("Scanning failed: " + error);
				}
			);
	//	start_install('H49',false);
	});



	$(document).on('click','#root_menu_buttons',function(){

			if($("#root_menu").hasClass("show_menu"))
			{
				$("#root_menu").addClass("hide_menu");
				$("#root_menu").removeClass("show_menu");

				$("#menu_background").removeClass("menu_open");
			}else
			{
				$("#root_menu").addClass("show_menu");
				$("#root_menu").removeClass("hide_menu");

				$("#menu_background").addClass("menu_open");
			}
		}
	);

	$(document).on('click','#menu_background',function(){

			$("#root_menu").addClass("hide_menu");
				$("#root_menu").removeClass("show_menu");

				$("#menu_background").removeClass("menu_open");

		}
	);


	$(document).on('click','.single_menu',function(){


				$("#root_menu").addClass("hide_menu");
				$("#root_menu").removeClass("show_menu");

				$("#menu_background").removeClass("menu_open");

		}
	);

	$("#root_menu").on('swipeleft',function(){


				$("#root_menu").addClass("hide_menu");
				$("#root_menu").removeClass("show_menu");

				$("#menu_background").removeClass("menu_open");

		}
	);


	$(document).on('tap','.single_menu_btn', function(e){

		   $(".tapped").removeClass('tapped');
	    $(this).addClass('tapped');


	});

		$(document).on('tap','.single_bookmark', function(e){

		   $(".tapped").removeClass('tapped');
	    $(this).addClass('tapped');


	});








	$(document).on('click','.add_to_favs',function(e)
	{
			var book_type =Array();

			if(!$(this).hasClass("favourite"))
			{
					book_type[0]='places';
					book_type[1] = $(this).data('long');
					book_type[2] = $(this).data('lat');
					app.current_hotel.addToBookmarks($(this).data('id'),book_type)	;
					$(this).addClass("favourite");

					leaf_messagin($(this).closest(".leaf_plugins").siblings(".info_box"),"Added to Places");
			}else
			{
				app.current_hotel.deleteFromBookmarks($(this).data('id'),false,'places')	;
				$(this).removeClass("favourite");
				leaf_messagin($(this).closest(".leaf_plugins").siblings(".info_box"),"Removed from Places");

			}
	});
	//Check when bookmark check box has changed
	$(document).on('click','.bookmark_plugin',function(e)
	{
		var book_type =Array();

		if(!$(this).hasClass("checked"))
		{
			book_type[0]='bookmark';

			var b_id = $(this).data('value');
			app.current_hotel.addToBookmarks(b_id,book_type)	;
			$(this).addClass('checked');
			leaf_messagin($(this).closest(".leaf_plugins").siblings(".info_box"),"Added to Bookmarks");
		}else
		{
			var b_id = $(this).data('value');
			$(this).removeClass('checked');
			app.current_hotel.deleteFromBookmarks(b_id,false,'bookmark')	;
			leaf_messagin($(this).closest(".leaf_plugins").siblings(".info_box"),"Removed from Bookmarks");
		}
	});


	$(document).on('click','.delete_bookmark',function(e)
	{
		e.preventDefault();
		var id = $(this).data('leaf_id');
		app.current_hotel.deleteFromBookmarks(id,true,'bookmark');

	});

	$(document).on('click','.delete_place',function(e)
	{
		e.preventDefault();
		var id = $(this).data('leaf_id');
		app.current_hotel.deleteFromBookmarks(id,true,'places');

	});


	// On click Push notes button
	/*$(document).on('click','.push_notes_btn',function(e)
	{

		app.current_hotel.showNotifications();

	});*/

	$("#install_data").find("a").click(function(e)
	{
			e.preventDefault();
			app.HotelDb.populateDb();
			app.homeview.initialize();
			$("#install_data").addClass("hidden");
			$("#delete_data").removeClass("hidden");

	});

	$("#delete_data").find("a").click(function(e)
	{
			e.preventDefault();

			app.HotelDb.deleteDb();
			app.homeview.initialize();

			$("#delete_data").addClass("hidden");
			$("#install_data").removeClass("hidden");

	});

	//Bind before change - Create page
	$(document).bind("pagebeforechange", function(e,data)
	{
			//Move map_box back to repository
			$("#map_box").appendTo("#repository");
			$(".view_leaf_map").removeClass("open");
			$(".view_leaf_map").removeClass("clicked");
			$(".distance_calc").html("");
			$(".map_container").hide();

			$(".tapped").removeClass('tapped');
			$("#appies_list").hide();

			if($("#root_menu").hasClass("show_menu"))
			{
				$("#root_menu").addClass("hide_menu");
				$("#root_menu").removeClass("show_menu");
			}

			if(!$("#main_menu_collapse").find('.ui-collapsible-heading').hasClass('ui-collapsible-heading-collapsed'))
			{
				$("#main_menu_collapse").find('.ui-collapsible-heading').trigger('click');
			}

			//Take care of bindings so as to direct to the correct page
			if ( typeof data.toPage === "string" ) {

				// We are being asked to load a page by URL, but we only
				// want to handle URLs that request the data for a specific
				// category.
				var u = $.mobile.path.parseUrl( data.toPage );

				create = /^#createHotel/;
				viewplugin = /^#plugin/;
				viewsub = /^#hotelItem/;
				viewmain = /^#oneappy_hotel_main/;


				////console.log(u.search);

				if ( u.hash.search(create) !== -1 ) {



					clear_pushnotes_interval();


					$("#menu_username").html("");
					$("#menu_room_no").html("");
					$("#menu_vip_enabled").html("");


					show_root_loader($(this),'Loading, Please wait');

					// We're being asked to display the items for a specific category.
					// Call our internal method that builds the content for the category
					// on the fly based on our in-memory category data structure.

					//Check if hotel Assets as in place


					app.create_hotel( u, data.options );

					/* $("#root_header").removeClass("hidden_on_top");*/
					 $("#root_menu_buttons").removeClass("hidden_left");
					$(".push_notes_btn").removeClass("hidden_on_top");
					$(".vipEnabled").removeClass("hidden_on_top");
					$(".geolocEnabled").removeClass("hidden_on_top");
					$(".roamingEnabled").removeClass("hidden_on_top");

					$("#root_header").addClass("reveal_header");
					$("#root_menu_buttons").addClass("reveal_menu");
					$(".push_notes_btn").addClass("reveal_envelope");

					$(".geolocEnabled").addClass("reveal_geoloc");
					$(".roamingEnabled").addClass("reveal_roaming");
					$(".vipEnabled").addClass("reveal_vipEnabled");





					// Make sure to tell changePage() we've handled this call so it doesn't
					// have to do anything.
					e.preventDefault();
				}else if ( u.hash.search(viewsub) !== -1 ) {


					if(app.current_hotel.current_view !='')
					{
						//console.log("Current view = "+app.current_hotel.current_view.$page_div.find('.collapsible_menu').attr('id'));
						$("#leaf_"+app.current_hotel.current_view.id).find('.ui-collapsible-heading').trigger('click');
					}else
					{
						//console.log("Current view is empty");
					}

					// We're being asked to display the items for a specific category.
					// Call our internal method that builds the content for the category
					// on the fly based on our in-memory category data structure.
				 	app.current_hotel.create_subcat(u, data.options );


					// create_hotel();

					// Make sure to tell changePage() we've handled this call so it doesn't
					// have to do anything.





					e.preventDefault();
				}else if ( u.hash.search(viewplugin) !== -1 ) {


					//Close Menu


					if(app.current_hotel.current_view !='')
					{

						var pl_id = '#plugin_'+app.current_hotel.current_view.template+'_'+app.current_hotel.current_view.parent_id;
						$(pl_id).find('.ui-collapsible-heading').trigger('click');
					}

					// We're being asked to display the items for a specific category.
					// Call our internal method that builds the content for the category
					// on the fly based on our in-memory category data structure.
				 	app.current_hotel.create_plugin(u, data.options );


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


		/*	if($(".collapsible_menu").length > 0)
			{
				//console.log("collapse");
				$(".collapsible_menu").trigger('collapse');
			}*/



			}

		/*
			$("#loading_page").removeClass("loading");
			$("#loading_page").addClass("loaded");	*/


	});

}
//);//End document ready





app={
		current_hotel:"",
		occupied_ids:[],
		lat:'',
		long:'',
		homeview:'',
		geolocation:'on',
		system_geolocation :'off',
		//Memory Object oneAppyMemory
		HotelDb:'',
		map:'',
		markers:[],
		version:1, //Current Version of one appy. It is used so as to receive the correct plugins
		appy_uid:'',
		options:'',
		app_dir:'oneappy',
		directory_created:'false',
		current_install_assets:0,
		localFilePath :'',
		cancel_installation_flag:false,
	  current_install_step:0,
		interval_id:-10,
		//selected language set
		current_lang:'English',
		host:'http://www.oneappy.com',
		googleMapsLoaded:'false', //Set to true if googlemaps have been loaded


		initialize:function()
		{




			var self = this;//Create HomeView object


			this.HotelDb =this.getDb();
			this.HotelDb.populateDb();

			//Get Folder Path
			var a = new DirManager(); // Initialize a Folder manager
			a.get_home_path(app.set_home_path);


      a.create_r(app.app_dir+'/app_images',Log);


				//Load external maps

			loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDY4mWiTwof0gYR1K7GlZ6NwX-ToIkKf0E&sensor=false&callback=initialize_maps','google_map');




			checkRoaming(false,false);

			setInterval(function () {
						checkRoaming(false,false);
						navigator.geolocation.getCurrentPosition(app.getGeoLocation,app.geoLocationError);
			}, 600000);
			//initialize_maps();

			this.HotelDb.db.get('system_one_appy_1').then(function(doc){


				app.geolocation  = doc.geolocation ;
				app.roaming  = doc.roaming ;
				app.appy_uid=doc.appy_uid ;


					$("#options_box").append("<div class='appy_id_text accent_text'>Your 1 Appy id is : "+app.appy_uid+"</div>");
		/*		if(app.geolocation =='on')
				{
					//alert("GEOLOC I" +doc.geolocation);
					$(".geolocEnabled").removeClass("disabled");
				}*/





			}
			).catch(function(error){


				});




		},


		set_home_path :function(nativeURL)
		{

			app.localFilePath = nativeURL;

				app.homeview = new HomeView(app.HotelDb);
				//alert("End init_home A");
				if($(".single_front_item").length > 0)
				{
					//console.log("Single Hotel");
					//console.log("2");
				}else
				{
					//console.log("3");
						$("#install_data").removeClass("hidden");
				}
		},

		setCurrentHotel:function(hotel)
		{
			this.current_hotel = hotel;
		},


		create_hotel:function(u, options)
		{

			this.clearLeafs();


			var hotel = new Hotel(u,"#one_appy_hotel_main",this.HotelDb);
			this.setCurrentHotel(hotel);


			
			//	hotel.render();

//Start test for directory
			var vars = getUrlVars(u.hash);
			var h_id = vars['id'];
		//	var logo = vars['logo'];
			var testFilePath=  app.localFilePath+'/'+app.app_dir+'/dir'+h_id+'/';//+logo;

			app.options = options;

			app.HotelDb.db.get(h_id).then(function(doc){

			var testfile =testFilePath+removeUrl(doc.logo);

					//failed_dir();
					window.resolveLocalFileSystemURL(testFilePath , directory_exists, failed_dir);
			}).catch(function(){});







		/*	$status = document.querySelector("#status");

			$status.innerHTML = "Checking for data file.";

			store = cordova.file.dataDirectory;*/

			//Check for the file.







				// var a = new DirManager();
			 //a.list(testFilePath,directory_exists,failed_dir);
			 //directory_exists(true);




//End test for directory




/*
			var $page = $("#one_appy_hotel_main");
			$page.page();
			$.mobile.changePage( $page, options ) ;
*/
		},

		gotoRootMain:function()
		{
			var $page = $("#one_appy_hotel_main");
			$page.page();
			$.mobile.changePage( $page, options );
		},


		getDb:function()
		{
			var db = new oneAppyMemory('oneappyhotel');
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

		getGeoLocation:function(position)
		{

			//sendMessage("Geoloc");

			$(".geolocEnabled").removeClass("disabled");
			if(	app.system_geolocation=='off')
			{
				app.system_geolocation='on';
				app.long = position.coords.longitude;
				app.lat = position.coords.latitude;
				//console.log("setting at "+app.lat+" = "+app.long);
				//app.sendMessage("setting at "+app.lat+" = "+app.long);
				var latlong = new google.maps.LatLng(app.lat ,app.long);
				//app.sendMessage("Geo 1a");
				var mapOptions=
				{
					center:latlong,
					zoom:16,
					mapTypeId:google.maps.MapTypeId.ROADMAP
				};

				app.map = new google.maps.Map(document.getElementById("map_box"),mapOptions);


			}
			//display_info_message("Geolocation is enabled");

			//var map = new google.maps.Map(
		//	alert("get geo end ");
		},

		geoLocationError:function(error)
		{
			//this.sendMessage("Error "+error.code+"\n"+error.message+'\n');
			$(".geolocEnabled").addClass("disabled");
			app.system_geolocation='off';
			app.geolocation='off';

			$(".geolocEnabled").addClass("disabled");

			app.long = 0;
			app.lat = 0;
			//console.log("setting at "+app.lat+" = "+app.long);
			//app.sendMessage("setting at "+app.lat+" = "+app.long);


			if (typeof google === 'object' && typeof google.maps === 'object') {

				var latlong = new google.maps.LatLng(app.lat ,app.long);





					//app.sendMessage("Geo 1a");
					var mapOptions=
					{
						center:latlong,
						zoom:16,
						mapTypeId:google.maps.MapTypeId.ROADMAP
					};

					app.map = new google.maps.Map(document.getElementById("map_box"),mapOptions);


			}else
		 	{

		 	}


		},



		setAppsMarker:function(map)
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
		},

		clearMarkers:function()
		{
				for(i=0;i<app.markers.length;i++)
				{
					app.markers[i].setMap(null);
				}
		}




};


//app.initialize();

function sendMessage(str)
		{

				alert(str);

}

function getConfirmation(str)
{



	var txt;
	var r = confirm(str);
	if (r == true) {
		txt = "You pressed OK!";
	} else {
		txt = "You pressed Cancel!";
	}

	return r;
}
