
var CreateModeClassic = function(qc) {
  this.canvas = qc.getCanvas();
  this.panel = qc;
  this.lastVertex = null;
  
}

CreateModeClassic.prototype.enable = function() {
  this.canvas.selection = false;
  var that = this;
  this.newPath = function(e) {
    that.lastVertex = null;
    e.preventDefault();
  }
  
  this.panel.vertices.forEach(function(vertex) {
    vertex.lockRotation = true;
    vertex.lockScalingX = true;
    vertex.lockScalingY = true;
    vertex.lockMovementX = true;
    vertex.lockMovementY = true;
    vertex.hasBorders = false;
    vertex.hasControls = false;
  
  });
  this.panel.arrows.forEach(function(arrow) {
    arrow.selectable = false;
  });
  this.canvas.renderAll(false);
  this.onMouseDown = function(options) {
    
    if(options.target == undefined) {
    
      var pointer = that.canvas.getPointer(options.e);
      var vertex = that.panel.newVertex(pointer.x, pointer.y);
      

     
      if(that.lastVertex != null) {
        
        var arrow = that.panel.newArrow(that.lastVertex,vertex);
        vertex.arrows.push(arrow);
        that.lastVertex.arrows.push(arrow);
        
        var o = new Object;
        o.left = that.canvas.getPointer(options.e).x;
        o.top = that.canvas.getPointer(options.e).y;
        var a = getVerticesAngle(that.lastVertex, o);
        
        that.canvas.sendToBack(arrow);
        that.lastVertex = null;

      } 
    }
    else if(options.target.type==="vertex"){
      if(that.lastVertex != null) {
        var arrow = that.panel.newArrow(that.lastVertex, options.target);
        options.target.arrows.push(arrow);
        that.lastVertex.arrows.push(arrow);
        getVerticesAngle(that.lastVertex, options.target);
        
        
        that.canvas.sendToBack(arrow);
        that.lastVertex = null;
      } else {
        that.lastVertex = options.target;
      }
    }
  }
  
  this.canvas.on("mouse:down", this.onMouseDown);
  //?
  //fabric.util.addListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.newPath);
}
CreateModeClassic.prototype.disable = function() {
  this.canvas.off("mouse:down", this.onMouseDown);
  //fabric.util.removeListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.newPath);
}

