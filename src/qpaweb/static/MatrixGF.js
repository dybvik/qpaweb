
var MatrixGF = new fabric.util.createClass(fabric.Object, {
  type: "matrix",
  
  initialize: function (data, options) {
    options || (options = { });
    this.data = data;
    this.callSuper("initialize", options);
    this._makeMatrix();
  },

  _render: function(context) {
    var totalWidth = _.reduce(this.columns, function(sum, val) {return sum+val}, 0);
    var height = this.columns[0].getHeight();//assume equal height
    //context.moveTo(-totalWidth/2, -height/2);
    var x = -totalWidth/2;
    var y = -height/2;

    for(var i = 0; i < this.columns.length;i++) {
      context.save();
      context.translate(x,y);
      this.columns[i].render(context);
      context.restore();
      x+=totalWidth/this.columns.length;
    }

  },

  setMatrix: function(matrix) {
    this.data = matrix;
    this._makeMatrix();
  },

  _makeMatrix: function() {
    if(this.data.length == 0 || this.data[0].length == 0) {
      this.columns = [new fabric.Text("0")];
      return;
    }
    this.columns = Array(this.data[0].length);
    for(var i = 0; i < this.columns.length;i++) {
      this.columns[i] = fabric.Text("");
      this.columns[i].textAlign = "center";
    }
    for(i = 0; i < this.data.length; i++) {
      for(var j = 0; j < this.data[i].length;j++) {
        this.columns[j].set("text", this.columns[j].get("text") + "\n" + this.data[i][j]);
      }
    };
    
  },

});
