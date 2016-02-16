// JavaScript Document



function AppKid(Memory,template_id,id){

		this.id = id;

		//Kids Details
		this.name ;
		this.sex;
		this.birthdate;
		this.birthweight;
		this.birthheight;
		this.first_word;
		this.firststride;
		this.firstlaugh;
		this.firstwalk;

		this.graph_data_weight;
		this.graph_data_height;// = graph_data_height ; //contains title, data, plot axis titles
		this.graphHeight; //appGraph object
		this.graphWeight; //appGraph object

		this.template; //Template object for handlenbar
		this.appData=[];
		this.container=$("<div/>");
		this.Memory = Memory;
		this.rootFilePath='aa';
		this.template_id= template_id;

		this.calendar_array=[];

		this.actionsSet = false;

		this.initialize = function()
		{

		//	alert("initializing start");

			this.container.addClass("app_page")
			this.container.attr("id","kid_"+this.id);
		//	alert("1");//$("#front_page_app").html());
			this.template = Handlebars.compile($("#"+this.template_id).html());
			//alert("Template set, setting context");
			//Should Add a clean up of al nodes begore rerendering
			this.setContext();
	//		alert("initializing End ");

			//console.log(this.appData);

		};

		this.render = function()
		{
		//	alert(JSON.stringify(this.appData));

		//	alert("Kid REnder ");

			app.clean_up();

			var context = this.appData;
			var html = this.template(context) ;
			this.container.html(html);

			this.setKidActions();

			return this;

		};



		this.setContext = function()
		{
			//Read database and fill context

				var self = this;

			//	alert(self.id);
				app.appDb.db.get(self.id).then(function(doc){

				//	alert(JSON.stringify(doc));
			//	alert("setContext Got data");
					var image = "boy";

					if(doc.sex=='female')
					{
							image="girl";

					}else {
							image="boy";
					}

					self.name = doc.name;
					self.sex = doc.sex;
					self.birthdate = doc.birthdate;
					self.birthweight = doc.birthweight;
					self.birthheight = doc.birthheight;
					self.first_word = doc.first_word;
					self.firststride = doc.firststride;
					self.firstlaugh = doc.firstlaugh;
					self.firstwalk = doc.firstwalk;
					self.image = image;
					self.delete_id = doc.delete_id;
					doc.kids_image = image;
					self.appData = doc;


					//get all entries related to kid
					app.appDb.db.query('delete_id', {
							key: self.delete_id,
							include_docs: true,
							attachments: true
						}).then(function (result) {

						//	alert("got entries");
							self.calendar_array=[];
							var index=0;
							result.rows.forEach(function(row) {

								if(row.doc.doc_type=='kid_reading')
								{

									var entry={
											entry_date:row.doc.entry_date,
											entry_weight:row.doc.entry_weight,
											entry_height:row.doc.entry_height,
											entry_index:index,
											entry_id:row.doc._id
									}

								self.calendar_array[index++] = entry ;//.push(entry);
								}
							});

								self.appData['calendar'] = self.calendar_array;

								if(self.sex=="male")
								{
									self.graph_data_height = boys_height_init;
									self.graph_data_weight = boys_weight_init;
								}else {
									self.graph_data_height = girl_height_init;
									self.graph_data_weight = girl_weight_init;
								}

							//	alert("setting Graph");
								self.graphHeight = new appGraph(self.id+"_graph_height",self.graph_data_height);
								self.graphWeight = new appGraph(self.id+"_graph_weight",self.graph_data_weight);
						//	alert("Set contetx end")
								self.render();

						}).catch(function(error){

						});;





			}).catch(function(response){


			});
				//alert(app.localFilePath);

				//Create Design Doc for Type Query

				self.appData.length = 0;







		}; //End Set context

		this.assign_addKidFieldAction =function($form)
		{
				var self = this;

				console.log("Assign Actions");

				$form.find(".add_kid_field_button").click(function(){

						console.log("Assigned Action Add");

				if($(this).closest(".kid_edit_form").find("input").val() == '')
				{

					return 0;
				}


				var p_id = $(this).closest(".kid_data_entry").data("parent_id");
				var value ;
				var type=$(this).closest(".kid_data_entry").data("input_type");
				var field = $(this).closest(".kid_data_entry").data("input_field");

				if(type == 'date')
				{
					var entry_date = new Array();
					entry_date['day'] =   $(this).closest(".kid_edit_form").find("input:text[name=day]").val();
					entry_date['month'] =   $(this).closest(".kid_edit_form").find("input:text[name=month]").val();
					entry_date['year'] =    $(this).closest(".kid_edit_form").find("input:text[name=year]").val();
					value =entry_date['day']+'|'+	entry_date['month'] +'|'+entry_date['year'];

				}else if(type == 'radio')
				{
					value  = $(this).closest(".kid_edit_form").find("input[name=sex]:checked").val()


				}else {
					value = $(this).closest(".kid_edit_form").find("input").val();

				}


			//	alert(value+" - "+self.id+" - "+type+" - "+field);


				app.appDb.db.get(p_id).then(function(doc){


					doc[field] = value;
				//	alert("add_kid_field_button : "+JSON.stringify(doc));

					app.appDb.db.put(doc).then(function()
					{
						self.setContext();

					}).catch(function (err) {

					});

				}).catch(function(response){


				});

			}); //end add kid field button



				$form.find(".cancel_kid_field_button").on('click',function(element){
					//alert("cancel");
								$(this).closest(".kid_data_entry").find(".edit_kid_value").removeClass("hidden");
								$(this).closest(".kid_data_entry").find(".kid_data_entry_value").removeClass("hidden");

								$(this).closest(".kid_data_entry").find(".add_kid_value").removeClass("hidden");
								$(this).closest(".kid_data_entry").find(".kid_edit_form").remove();


				});


		};


		this.setKidActions= function()
		{

				var self = this;


			//	if(!self.actionsSet)
			//	{
			//		self.container.find(".add_kid_value").map(function(element){

						self.container.find(".add_kid_value").off('click');
						self.container.find("edit_kid_value").off('click');
						self.container.find(".edit_kid").off('click');
						self.container.find(".entry_delete").off('click');
						self.container.find(".add_reading_button").off('click');
						self.container.find(".curves_button").off('click');


						 	self.container.find(".add_reading_title").off('click');

						 	self.container.find(".add_reading_title").on('click',function()	{

									if($(this).hasClass("active"))
									{
										$(this).removeClass("active");
										$(this).siblings(".latest_reading_form").addClass("hidden");
									}else {
										$(this).addClass("active");
										$(this).siblings(".latest_reading_form").removeClass("hidden");
									}



							});

							self.container.find(".add_kid_value").on('click',function(){

								$(this).addClass("hidden");

								var form = $("<div/>");
								form.addClass("kid_edit_form");

								//Get form type
								var p_id = $(this).closest(".kid_data_entry").data("parent_id");
								var type=$(this).closest(".kid_data_entry").data("input_type");
								var field = $(this).closest(".kid_data_entry").data("input_field");

							//	alert(type+" field "+field);

								var form_template = 	Handlebars.compile($("#kid_forms_"+type).html());



								var context = {id:p_id};
								var html = form_template(context) ;
								form.html(html);

								self.assign_addKidFieldAction(form);



								form.appendTo($(this).closest(".kid_data_entry"));

							});
			//		});



			self.container.find(".edit_kid").on('click',function(){

				if($(this).hasClass("active"))
				{
					$(this).closest(".app_page").find(".kids_details").addClass("not_editing");
					$(this).find("span").html("edit");
					$(this).removeClass("active");
				}else {
					$(this).closest(".app_page").find(".kids_details").removeClass("not_editing");

					$(this).find("span").html("finish editing");
					$(this).addClass("active");
				}

			});

			//	self.container.find(".edit_kid_value").map(function(element){

				self.container.find(".edit_kid_value").on('click',function(){


							$(this).addClass("hidden");
							$(this).closest(".kid_data_entry").find(".kid_data_entry_value").addClass("hidden");
							var form = $("<div/>");
							form.addClass("kid_edit_form");


							//Get form type
							var p_id = $(this).closest(".kid_data_entry").data("parent_id");
							var type=$(this).closest(".kid_data_entry").data("input_type");
							var field = $(this).closest(".kid_data_entry").data("input_field");
							var value = $(this).closest(".kid_data_entry").data("input_value");
						//	alert(type+" field "+field);

							var form_template = 	Handlebars.compile($("#kid_forms_"+type).html());

							var context = {id:p_id,entry:value};
							var html = form_template(context) ;
							form.html(html);

							self.assign_addKidFieldAction(form);

							form.appendTo($(this).closest(".kid_data_entry"));

						});
			//	});






						self.actionsSet = true;

			//	} //End init actions set
			//	$("#app_pages").on('click','.add_kid_value',function(){




			//	});






				self.container.find(".entry_delete").on('click',function(){


			//		$(".entry_delete")
				//	alert("delete");
					var id = $(this).data("entry_id");

					app.appDb.db.get(id).then(function(doc){

							app.appDb.db.remove(doc).then(function(){

									self.setContext();

							})


					}).catch(function(response){

					});

				});




				self.container.find('.add_reading_button').on('click',function(){



					var $parent_form = $(this).closest(".latest_reading_form");

					var height = $parent_form.find(".latest_height").find("input").val();
					var weight = $parent_form.find(".latest_weight").find("input").val();

					var entry_date = new Array();
					entry_date['day'] =	$parent_form.find(".latest_date").find("input:text[name=day]").val();
					entry_date['month'] =	$parent_form.find(".latest_date").find("input:text[name=month]").val();
					entry_date['year'] =	$parent_form.find(".latest_date").find("input:text[name=year]").val();

					if(height == '' || weight=='' || entry_date['day']=='' || 	entry_date['month']=='' || entry_date['year']=='')
					{
						alert("Συμπληρώστε ολα τα πεδία");
						return 0;
					}


					var formatted_entry_date = entry_date['day']+'|'+entry_date['month']+'|'+entry_date['year'];


					app.appDb.db.post({

								doc_type:'kid_reading',
								delete_id:self.delete_id,
								entry_date:formatted_entry_date,
								entry_weight:weight,
								entry_height:height
					}).then(function(doc){

						self.setContext();

					}).catch(function(response){


					});

				}); //End add_reading button


				self.container.find('.curves_button').on('click',function(){

					if($(this).hasClass("active"))
					{

						$(this).removeClass("active");
						$("#graph_box").appendTo("#repository");
						$("#graph_box").empty();

					}else {

						$(".curves_button").removeClass("active");

						$("#graph_box").empty();
						$(this).addClass("active");
						var self = app.current_object; //Get reference to parent Object from app

						var value = $(this).closest(".single_calendar_entry").find(".height_entry").data("value");
						var value_w = parseFloat($(this).closest(".single_calendar_entry").find(".weight_entry").data("value"))/1000;
						var entry_date = $(this).closest(".single_calendar_entry").find(".date_entry").data("value");


						reading_age = getAge(entry_date,self.birthdate);
					//	alert(reading_age);


					var user_entry_h = [{
							x: [reading_age],
							y: [value],
							 mode: 'markers',
						 line: {
							 color: 'rgb(234,0,0)',
							 width: 1
						 },
							name:'Υψος'
						}];

						var user_entry_w = [{
								x: [reading_age],
								y: [value_w],
								 mode: 'markers',
							 line: {
								 color: 'rgb(234,0,0)',
								 width: 1
							 },
								name:'Βάρος'
							}];


						console.log("Plotting for "+self.name );
						if($(this).data("curve_type") == "height")
						{
								console.log("Plotting Height");
								self.graphHeight.display($(this).closest(".single_calendar_entry").find(".curves_container"),user_entry_h);
						}else {
								console.log("Plotting Weight");
								self.graphWeight.display($(this).closest(".single_calendar_entry").find(".curves_container"),user_entry_w);
						}



					}



			//		$(".entry_delete")

				});


		};

		 this.initialize();

};





//var Homeview = new HomeView();

//Get template
//Homeview.template = Handlebars.compile($("#front_page_list").html());
