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

		//	alert("1");//$("#front_page_app").html());
			this.template = Handlebars.compile($("#front_page_app").html());
			//Should Add a clean up of al nodes begore rerendering
			this.setContext();
			//console.log(this.appData);
			this.render();

		};

		this.render = function()
		{

			var context = {App:this.appData};
			var html = this.template(context) ;
			this.container.html(html);

			return this;

		};



		this.setContext = function()
		{
			//Read database and fill context

				var self = this;
				//alert(app.localFilePath);

				//Create Design Doc for Type Query

				self.appData.length = 0;







		}; //End Set context

		 this.initialize();

};





//var Homeview = new HomeView();

//Get template
//Homeview.template = Handlebars.compile($("#front_page_list").html());
