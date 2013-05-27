
var MatrixGF = new fabric.util.createClass(fabric.Object, {
  type: "matrix",
  
  initialize: function (data, options) {
    options || (options = { });
    this.data = data;
    this.callSuper("initialize", options);
    this._makeMatrix();
  },

  _render: function(context) {
    var totalWidth = _.reduce(this.columns, function(sum, val) {return sum+val.width}, 0);
    var height = this.columns[0].getHeight();//assume equal height
    //context.moveTo(-totalWidth/2, -height/2);
    var x = -totalWidth/2;
    var y = 0;//height/2;

    for(var i = 0; i < this.columns.length;i++) {
      context.save();
      context.translate(x,y);
      this.columns[i]._render(context);
      context.restore();
      x+=this.columns[i].width+10;
    }
    

  },

  setMatrix: function(matrix) {
    this.data = matrix;
    this._makeMatrix();
  },

  _makeMatrix: function() {
    console.log(this.data);
    var i = 0;
    if(this.data == 0 || this.data.length == 0 || this.data[0].length == 0) {
      this.columns = [new fabric.Text("0")];
      return;
    }
    this.columns = Array(this.data[0].length);
    for(i = 0; i < this.columns.length;i++) {
      this.columns[i] = new fabric.Text("", {top:0,left:0});
      this.columns[i].textAlign = "center";
      this.columns[i].fontSize = 20;
    }
    for(i = 0; i < this.data.length; i++) {
      for(var j = 0; j < this.data[i].length;j++) {
        this.columns[j].set("text", this.columns[j].get("text") + this.data[i][j]);
        if(i != this.data.length-1) {
          this.columns[j].set("text", this.columns[j].get("text") + "\n");
        }
      }
    };
    this.width = _.reduce(this.columns, function(sum, val) {return sum+val.width}, 0);
    this.height = this.columns[0].getHeight();//assume equal height
    this.setCoords();
  },

});
