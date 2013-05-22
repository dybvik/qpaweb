
var EraseMode = function(qc) {
  this.canvas = qc.getCanvas();
  this.panel = qc;
  this.lastVertex = null;
  
}

EraseMode.prototype.enable = function() {
  this.canvas.selection = false;
  var that = this;
  var tt = 0;

  
  _.forEach(this.panel.vertices, function(vertex) {
    vertex.lockRotation = true;
    vertex.lockScalingX = true;
    vertex.lockScalingY = true;
    vertex.lockMovementX = true;
    vertex.lockMovementY = true;
    vertex.hasBorders = false;
    vertex.hasControls = false;
  
  });
  _.forEach( this.panel.arrows, function(arrow) {
    arrow.selectable = true;
  });
  this.canvas.renderAll(false);
  this.onMouseDown = function(options) {
    if(that.panel.moving) {that.panel.moving = false; return;}
    var pointer = that.canvas.getPointer(options.e);
    
    if(options.target.type==="vertex" || options.target.type =="arrow"){
      that.panel.quiver.remove(options.target.data);
    } 
  }
  this.canvas.on("mouse:down", this.onMouseDown);

  
  //?
  
}
EraseMode.prototype.disable = function() {
  this.canvas.off("mouse:down", this.onMouseDown);
 }

