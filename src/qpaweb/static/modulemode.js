
var ModuleMode = function(quiverpanel) {
  this.canvas = quiverpanel.getCanvas();
  this.panel = quiverpanel;
  this.module = null;
}

ModuleMode.prototype.enable = function() {
  var that = this;

  if(this.module == null) {return;}
  this.canvas.selection = false;
  
  _.each(this.panel.vertices, function(vertex) {
    vertex.lockRotation = true;
    vertex.lockScalingX = true;
    vertex.lockScalingY = true;
    vertex.hasControls = false;
    vertex.lockMovementX = false;
    vertex.lockMovementY = false;
    vertex.hasBorders = false;
    vertex.setLabel(that.module.vectorSpaces[vertex.data.name]);
  });

  _.each(this.panel.arrows, function(arrow) {
    arrow.setLabel(new MatrixGF(that.module.matrices[arrow.data.name]));
  });

  var onMouseDown = function(event) {
    console.log("msoda");
    if(event.target.type == "vertex") {
      GetInput("Set vertexspace", event.target.x, event.target.y, function(value) {
        that.module.setVectorSpace(vertex.name, parseInt(value));
      });
    }
  }
  this.canvas.on("mouse:down", onMouseDown);
  
  
  that.canvas.renderAll();
}

ModuleMode.prototype.disable = function() {
  _.each(this.panel.vertices, function(vertex) {
    vertex.setLabel(vertex.data.name);
  });
  _.each(this.panel.arrows, function(arrow) {
    arrow.setLabel(arrow.data.name);
  });
}
