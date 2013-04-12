
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
    arrow.selectable = false;
  });
  this.canvas.renderAll(false);
  this.onMouseDown = function(options) {
    if(options.target == undefined) {
    
      var pointer = that.canvas.getPointer(options.e);
      //var vertex = that.panel.newVertex(pointer.x, pointer.y);
      var vertex = new Vertex(that.panel.vertexNamer.next(), pointer.x, pointer.y);
      that.panel.quiver.add(vertex);
     
      if(that.lastVertex != null) {
        
        //var arrow = that.panel.newArrow(that.lastVertex,vertex);
        var arrow = new Arrow(that.panel.arrowNamer.next(), that.lastVertex, vertex);
        vertex.arrows.push(arrow);
        that.lastVertex.arrows.push(arrow);
        that.panel.quiver.add(arrow);
        

        
        //that.canvas.sendToBack(arrow);
        that.lastVertex = null;

      } 
    }
    else if(options.target.type==="vertex"){
      if(that.lastVertex != null) {
        //var arrow = that.panel.newArrow(that.lastVertex, options.target);
        var arrow = new Arrow(that.panel.arrowNamer.next(),that.lastVertex, options.target.data);
        options.target.data.arrows.push(arrow);
        that.lastVertex.arrows.push(arrow);
        that.panel.quiver.add(arrow);
        
        that.lastVertex = null;
      } else {
        that.lastVertex = options.target.data;
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

