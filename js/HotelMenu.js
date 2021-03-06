// JavaScript Document

function HotelMenu(plugIns,topItems,vipPass,logo)
{
	this.plugIns = plugIns;
	this.topItems = topItems;
	this.vipEnabled=vipPass;
	this.logo = logo;

	this.renderPlugIns = function()
	{
		var template = Handlebars.compile($("#menuPlugIns").html());
		var pluginsEnabledArray = Array() ;


		//Render only enabled plugins
		for(i=0;i<this.plugIns.length; i++)
		{
			if(this.plugIns[i]['version'] >= app.version)
			{


				if(this.plugIns[i]['type'] =='general')
				{
					pluginsEnabledArray.push(this.plugIns[i]);
				}else if(this.vipEnabled == 'true' && this.plugIns[i]['type']=='vip')
				{
					pluginsEnabledArray.push(plugIns[i]);
				}

			}


		}


		var context ={plugIns:pluginsEnabledArray };
		html = template(context);
		return html;
	}

	this.renderTopItems = function()
	{
		var template = Handlebars.compile($("#menuTopItems").html());
		var context ={topItems:this.topItems };
		html = template(context);
		return html;
	}

};
