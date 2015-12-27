function appGraph(id,initialData)
{


  this.id;

  this.container=$("<div/>");
  this.plotly_obj;


  this.initialData=initialData.graph_data; // data ploted as guides, if any

  this.layout;

  this.title = initialData.title;
  this.x_axis_title =initialData.x_axis_title;
  this.y_axis_title= initialData.y_axis_title;
  this.x_range;
  this.y_range;

  this.initialize = function()
  {
    this.layout =   this.setLayout();


  //  var data = this.initialData;

    this.container.attr("id",this.id);

    alert(JSON.stringify(this.initialData));
    //this.plotly_obj =  Plotly.newPlot(this.container, this.initialData,this.layout);


  };

  this.setLayout = function()
  {
    alert("start setting layout");
    var self = this;
    var layout = {
      title:self.title,
      xaxis: {
        title:   self.x_axis_title,
      //  range:self.x_range;
      },
      yaxis: {
        title:   self.y_axis_title,
      //  range:self.x_range;
      },

    };

    alert("End setting layout");

    return layout;

  };

  this.display = function($graph_container,user_values)
  {

    var plotDiv = document.getElementById('graph_box');
    var plotData = plotDiv.data;

    if(typeof(plotData) != 'undefined')
    {
        console.log("plot length "+plotData.length);
        Plotly.deleteTraces("graph_box",-1);
    }
    console.log("type :"+typeof(plotData));
      var data = this.initialData;

      for(i=0;i<user_values.length;i++)
      {
        console.log("ADDING "+i);
          data.push(user_values[i]);

      }



       Plotly.newPlot("graph_box", data,this.layout);
       $graph_container.append($("#graph_box"));
    //   $("#graph_box").appendTo(".graph_container");

  };


this.initialize();

}
