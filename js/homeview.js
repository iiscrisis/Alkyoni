// JavaScript Document

//Create the first page of the app
function AppyType(appy_type, family, icon ,Appy_container)
{
	this.appy_type = appy_type;
	this.family = family;
	this.icon = icon;
	this.container_id = Appy_container;

	this.objects =Array();

};


function HomeView(Memory){

		this.template; //Template object for handlenbar
		this.appData=[];
		this.container=$("<div/>");
		this.Memory = Memory;
		this.rootFilePath='aa';
		this.typeArray= Array();

		this.initialize = function()
		{
			this.container.addClass("app_page")
				this.container.addClass("text-center");
		//	alert("1");//$("#front_page_app").html());
			this.template = Handlebars.compile($("#front_page_app").html());
			//Should Add a clean up of al nodes begore rerendering
			this.setContext();
			//console.log(this.appData);

			this.setHomeviewActions();


		};



		this.render = function()
		{

			var context = {App:this.appData};
			var html = this.template(context) ;
			this.container.html(html);



			var tmpl_add = Handlebars.compile($("#add_child_template").html());
			html = tmpl_add(context) ;
			var add_form = $("<div/>");
			add_form.html(html);
	//		add_form.addClass("hidden");
			add_form.addClass("add_form_container");


			this.container.find("#kids_add").append(add_form);

			this.refreshKidsList();

			return this;

		};

		this.refreshKidsList=function()
		{



			var context = {App:this.appData};

			//Add children list
		//	alert($("#kids_list_template").html());
			var tmpl_kids_list = Handlebars.compile($("#kids_list_template").html());
		//	alert(context['App']['Kids'][0]['kids_name']);
			var kids_context = {kids:context['App']['kids']};

		//	alert(JSON.stringify(kids_context));

			html = tmpl_kids_list(kids_context) ;

		//	alert(html);
			var add_list = $("<div/>");
			add_list.html(html);
	//		add_form.addClass("hidden");

			this.container.find("#kids_list").append(add_list);

		}




		this.setHomeviewActions= function()
		{
			var self = this;


				$("#app_pages").on('click','.kid_delete',function(){


						var id=$(this).closest(".actions").data('kid_id');


					app.appDb.db.get(id).then(function(doc) {
						  return app.appDb.db.remove(doc);
						}).then(function (result) {
						  // handle result
								self.setContext();
						}).catch(function (err) {
						  console.log(err);
						});



				});

				$("#app_pages").on('click','.add_kid_button',function(){


						var sex = $("input[name=sex]:checked").val();

						var name =  $("input:text[name=baby_name]").val();
						var date = new Date();
						var id=date.getTime();


						if(sex!="" && name!="")
						{



							app.appDb.db.get(id).then(function(doc){


							}).catch(function(response){
								//	alert(id);
									return app.appDb.db.post(
										{

											delete_id:id,
											name:name,
											sex:sex,
										/*	birthdate:"",
										  birthweight:"",
										  birthheight:"",
										  first_word:"",
										  firststride:"",
										  firstlaugh:"",
										  firstwalk:"",*/

											doc_type:'kid_entry'


										}).then(function(result) {

									/*    var newKid = Kid

												kids_array.*/
												app.homeview.setContext();

										}).catch(function(){

												alert("error kid entered");

										});

							});





						}else {
							alert("Συμπληρωστε ολα τα πεδια");
						}
					});


		}


		this.setContext = function()
		{
			//Read database and fill context

				var self = this;
				//alert(app.localFilePath);

				self.Memory.db.query('doc_type', {
									key: 'kid_entry',
									include_docs: true,
									attachments: true
									}).then(function (result) {


										var kids_array=[];

										result.rows.forEach(function(row) {

											console.log(row.doc.name+" sex "+row.doc.sex);
											if(row.doc.sex=='female')
											{
													image="girl";

											}else {
													image="boy";
											}
											kid={
													kids_sex:row.doc.sex,
													kids_image:image,
													kids_name:row.doc.name,
													kids_id:row.doc._id

											}

											kids_array.push(kid);
										});

											self.appData={kids:kids_array};

											self.render();
							 // En
								}).catch(function (err) {});



				self.appData.length = 0;

			}; //End Set context

		 this.initialize();

};





//var Homeview = new HomeView();

//Get template
//Homeview.template = Handlebars.compile($("#front_page_list").html());
