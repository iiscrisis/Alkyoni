// JavaScript Document

function AppMemory(dbName)
{
	this.dbName = dbName;
	this.db;


	this.initialize = function()
	{
		this.db = 	this.returnDb();


	}

	this.render = function(hoteldata)
		{

		//	console.log("rendering");
		/*	var context = {Hotel:hoteldata};
			var html = this.template(context);
			this.el.html(html);

			//addedd as test maybe permanent
			$("#hotels_list").html(this.el);

			return this;*/

		};

	this.deleteDb = function()
	{
	//	console.log("Delete DB");
		this.db.destroy();
	}

	this.returnDb = function()
	{
		var db = new PouchDB(this.dbName);

		return db;
	}


	this.updateRoot = function(data)
	{

	//	console.log("update Root "+data['_id']);

		this.db.get(data['_id']).catch(function (err) {

			//If id	does not exsist add to DB



		});
	}

	this.populateDb = function()
	{
		var self = this;
		/*this.db.get('oneappy1').then(function(result){}).catch(function(error){self.populateDbok();});*/
		//db
		//alert("syste, 1");


		this.db.get('alkyoni_appy_1').then(function(doc){

		//alert("syste, 2");
		}
		).catch(function(){
				//alert("syste, 3");


			app.appy_uid = Date.now();
			//app.appy_uid = app.appy_uid.replace(".","");
			//alert(app.appy_uid);

		

			var types=[

			]

			self.db.put({
			  _id: 'alkyoni_appy_1',
			  geolocation: 'on',
			  roaming:'on',
			  appy_uid:app.appy_uid,
			  installed_types:types
			}).then(function(){
				//alert("system db");
				}).catch(function(error){alert("system Error");});



		});


		var ddoc = {
				  _id: '_design/doc_type',
				  views: {
					doc_type: {
					  map: function mapFun(doc) {
						if (doc.doc_type) {
						  emit(doc.doc_type);
						}
					  }.toString()
					}
				  }
				}

	this.db.put(ddoc, function (err) {
  		if (err && err.status !== 409) {
    		return console.log(err);
		}
  	});


		var deletedoc = {
				  _id: '_design/delete_id',
				  views: {
					delete_id: {
					  map: function mapFun(doc) {
						if (doc.delete_id) {
						  emit(doc.delete_id);
						}
					  }.toString()
					}
				  }
				}

	this.db.put(deletedoc, function (err) {
  		if (err && err.status !== 409) {
    		return console.log(err);
		}
  	});


	}



	this.initialize();
}
