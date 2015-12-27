function Kid(json_data)
{
  this.json_data = json_data;

  this.id;
  this.name ;
  this.birthdate;
  this.birthweight;
  this.birthheight;
  this.first_word;
  this.firststride;
  this.firstlaugh;
  this.firstwalk;


  this.initialize = function()
  {

    var self = this;
    alert(JSON.stringify(self.json_data));

  }


  this.initialize();


}
