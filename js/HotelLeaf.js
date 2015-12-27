// JavaScript Document

var MAX_SHORT_DESC = 200;

function HotelLeaf(hotel_title,hotel_id,hotel_menu,p_id,Memory)
{
	this.title = hotel_title;
	this.id= hotel_id;
	this.menu = hotel_menu;
	this.page_id;
	this.$page_div;
	this.parent_id = p_id;

	this.bookmark;

	this.Memory = Memory;
	this.rootFilePath='';
	//main data of category
	this.main_data ;
	this.branches ;
	this.logo ;
	this.description ;
	this.backgroundType;
	this.background ;

	this.initialize=function()
	{

		this.createPage();

		this.setContext();

		//this.render();


	}

	this.render=function()
	{

		var template = Handlebars.compile($("#hotel_leaf_page").html());
		var html = template(this.main_data);
		this.$page_div.find(".ui-content").html(html);

		var short_desc	 = this.$page_div.find(".main_description_short").html();

		var endofstr = '...';
		var readmore = 1;
		if(short_desc.length <= MAX_SHORT_DESC)
		{
			endofstr='';
			readmore = 0;
		}
		short_desc = short_desc.substring(0,MAX_SHORT_DESC)+''+endofstr;
		this.$page_div.find(".main_description_short").html(short_desc);
		if(!this.$page_div.find(".main_description_short").hasClass("show_on_first_load") )
		{
			this.$page_div.find(".main_description_short").addClass("show_on_first_load");

			//this.$page_div.find(".main_description_short").removeClass("hidden_on_first_load");
		}

		if( readmore==1)
		{

				this.$page_div.find(".toolbar_arrow_btn ").addClass("show_button_on_first_load");
				this.$page_div.find(".toolbar_arrow_btn ").removeClass("hidden_button_on_first_load");
		}

		//Gallery resize
		if(this.$page_div.find(".gallery_thumb").length > 0)
		{

			initialize_gallery_images(this.$page_div);
		}

		setFullScreen();
	}


	//Populate with the main data of the category
	this.createMainData=function()
	{



//		template
	}

	//get main context
	this.setContext=function()
	{
		var self = this;
		this.rootFilePath=  app.localFilePath+'/'+app.app_dir+'/dir'+this.parent_id+'/';
		//use this.id to retrieve context as JSON of the  Page
		this.Memory.db.get(this.id).then(function (doc) {

			var bookchecked = '';
			var longtitude_d='';
			var latitude_d='';
			var image_gallery_array='';
			var placesChecked='false';

			if(doc.bookmark == 'true')
			{
				bookchecked = 'checked';
			}

			if(doc.places == 'true')
			{
				placesChecked = 'true';
			}else
			{
			}

			if(doc.map ==='true')
			{
					longtitude_d = doc.longitude;
					latitude_d = doc.latitude;
			}

			if(doc.background == null)
			{

				doc.background = app.current_hotel.background;
				//alert("empty subs: "+doc.background);
			}


			if(doc.image_gallery ==='true' )
			{
				image_gallery_array = doc.image_gallery_images

				for(i=0;i<image_gallery_array.length;i++)
				{

						image_gallery_array[i]['icon'] = self.rootFilePath+removeUrl(image_gallery_array[i]['icon']);
				}

			}

			/*doc.logo =self.rootFilePath+removeUrl(doc.logo);*/
			if (typeof doc.background !== 'undefined') {
    // the variable is defined
					doc.background =self.rootFilePath+removeUrl(doc.background);
			}else
			{
					doc.background = '';
			}

			//check for logo
			var logo = null;
			if(doc.logo != null)
			{
				logo = self.rootFilePath+removeUrl(doc.logo);
			}

			self.main_data = {Data:
				[{
					title:doc.title,
					logo:logo,
					description:doc.description,
					backgroundType:doc.backgroundType,
					background:doc.background,
					subcategories : doc.subcategories,
					parent_id:self.parent_id,
					leaf_id:self.id,
					bookmark:bookchecked,
					places:placesChecked,
					map:doc.map,
					image_gallery:doc.image_gallery,
					longtitude:longtitude_d,
					latitude:latitude_d,
					image_gallery_images:image_gallery_array
				}]};


			self.logo = doc.title;
			self.description = doc.description;
			self.backgroundType = doc.backgroundType;
			self.background =  doc.background ;

			self.bookmark = bookchecked;

		  // handle doc
		//	alert(JSON.stringify(self.main_data));
		  self.render();

		}).catch(function (err) {

		});

	//	return context;
	}

	//get subcategories (branches )

	this.getBranches=function()
	{

			//based on this.id
			var subcategories=
			[
				{
					title:"Agia Napa",
					id:11
				},
				{
					title:"Panagia Kanala",
					id:12
				},
				{
					title:"Toy Skylou",
					id:13
				}
			]

			return subcategories;
	},


	this.createPage = function()
	{
		// if page exists assign it to $page_div
		if($("#leaf"+this.id).length > 0)
		{
			this.$page_div = $("#leaf"+this.id);
		}else
		{
			//create new jquery mobile page based on the template and assign it to $page_div
			this.$page_div = $('<div/>');
			this.$page_div.attr('data-role','page');
			this.$page_div.attr('data-url','leaf_'+this.id);
			this.$page_div.attr('id','leaf_'+this.id);
			this.$page_div.addClass("LeafPage");
			this.$page_div.appendTo('body');


		}



		var template = Handlebars.compile($("#page_template").html());
		var context={title:this.title };
		var html = template(context);
		this.$page_div.html(html);

		/* Menus does not need to copy itself
		this.$page_div.find(".collapsible_menu").attr('id','leaf_'+this.id+'collapsible');

			//render menus
		this.$page_div.find(".menu_plugins").html(this.menu.renderPlugIns());
		this.$page_div.find(".menu_topItems").html(this.menu.renderTopItems());

		*/

		//Go to page


	},


	//Delete the Div containing the
	this.deletePage = function()
	{
		if($("#leaf"+this.id).length > 0)
		{
			$("#leaf"+this.id).remove(this);
		}
	},



	this.initialize();
}
