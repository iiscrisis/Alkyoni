// JavaScript Document



function AppLeaf(Memory,template_id,id){

		this.id = id;
		this.template; //Template object for handlenbar
		this.appData=[];
		this.container=$("<div/>");
		this.Memory = Memory;
		this.rootFilePath='aa';
		this.template_id= template_id;


		this.initialize = function()
		{
			this.container.addClass("app_page")

		//	alert("1");//$("#front_page_app").html());
			this.template = Handlebars.compile($("#"+this.template_id).html());
			//Should Add a clean up of al nodes begore rerendering
			this.setContext();
			//console.log(this.appData);
			this.render();

		};

		this.render = function()
		{

			app.clean_up();

			var context = {App:this.appData};
			var html = this.template(context) ;
			this.container.attr("id","Leaf_"+this.id);
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
