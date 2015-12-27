// JavaScript Document

function removeUrl(str)
{
		var lindex = str.lastIndexOf("/");
		var file_dn = str;
		if(lindex != -1)
		{
			file_dn =  str.substring(str.lastIndexOf("/")+1,str.length);
		}else
		{
			file_dn = str;
		}

		return file_dn;
}



function file_system_examples(root_dir){

            var b = new FileManager();
            b.download_file('http://www.oneappy.com/files/hotels/1/smalllogo.jpg',root_dir+'/','smalllogo.jpg',Log);

}




function AppyFileSystem(root_folder,assets)
{
	this.rootFolder =app.app_dir+'/'+ root_folder;
	/*alert(this.rootFolder);*/
	this.assets= assets;


	this.downloadAssets = function(callback)
	{
		/*this.Download();
		downloadAssets(this.rootFolder,this.assets);
		*/
		var empty_file = new FileManager();
				// create an empty  FILE (simialr unix touch command), directory will be created RECURSIVELY if it doesnt exist
		empty_file.load_file(this.rootFolder,'.nomedia',callback,callback);

		  var b = new FileManager();
        	for(i=0;i<this.assets.length;i++)
			{
				var file_dn =  removeUrl(this.assets[i]["icon"]); //.substring(assets[i]["icon"].lastIndexOf("/")+1,assets[i]["icon"].length);
			/*	alert("File to Download = "+file_dn+" From "+assets[i]["icon"]+" TO :"+this.rootFolder+'/');*/
            	b.download_file(this.assets[i]["icon"],this.rootFolder+'/',file_dn,callback,callback) ;
			}

			/*b.download_file('http://oneappy.interten.gr/files/hotels/files/hotels/1/HI_mk_logo_hiltonbrandlogo_1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1_.jpg',this.rootFolder+'/','HI_mk_logo_hiltonbrandlogo_1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1__1_.jpg',alert('downloaded success'));*/


	}

	this.downloadAppFile = function(file,callback)
	{
		/*alert("App DOWNLOAD");*/
		var b = new FileManager();
		var file_dn =  removeUrl(file); //.substring(assets[i]["icon"].lastIndexOf("/")+1,assets[i]["icon"].length);
		var app_dir = app.app_dir+'/app_images/';
		//alert("APP File to Download = "+file_dn+" From "+file+" TO :"+app_dir);
        b.download_file(file,app_dir,file_dn,callback,callback);

		return app_dir+file_dn;
	}

	this.downloadFile = function(file)
	{
		//alert("File DOWNLOAD");
		var b = new FileManager();
		var file_dn =  removeUrl(file); //.substring(assets[i]["icon"].lastIndexOf("/")+1,assets[i]["icon"].length);
	// alert("File to Download = "+file_dn+" From "+file+" TO :"+this.rootFolder);
        b.download_file(file,this.rootFolder+'/',file_dn,Log);

		return this.rootFolder+'/'+file_dn;
	}

	this.listAssets = function(){

		//alert("Assets for "+this.rootFolder );
		for(i=0;i<this.assets.length;i++)
		{
		//	console.log(this.assets[i]["icon"]);
		}



	}





}//End class
