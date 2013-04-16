
var CreateModeClassic = function(qc) {
  this.canvas = qc.getCanvas();
  this.panel = qc;
  this.lastVertex = null;
  
}

CreateModeClassic.prototype.enable = function() {
  this.canvas.selection = false;
  var that = this;
  this.cancelArrow = function(e) {
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
        that.panel.helperArrow.set({x1: that.lastVertex.x, y1: that.lastVertex.y});
      }
    }
  }
  this.panel.helperArrow = new ArrowGFX([0, 0, 1, 1]);
  this.panel.helperArrow.set("visible", false);
  this.panel.helperArrow.set("selectable", false);
  this.canvas.add(this.panel.helperArrow);
  this.canvas.on("mouse:move", function(ev) {
    console.log("woof");

      var pointer = that.canvas.getPointer(ev.e);
      if(that.lastVertex != null /*&& (Math.abs((that.lastVertex.x - pointer.x) > 20 && Math.abs(that.lastVertex.y - pointer.y > 20)))*/) {
        that.panel.helperArrow.set("visible", true);
        that.panel.helperArrow.set({x2: pointer.x, y2: pointer.y});
      }
      else {
        that.panel.helperArrow.set("visible", false);
      }
      that.canvas.renderAll(false);
    
  });
  this.canvas.on("mouse:down", this.onMouseDown);

  
  //?
  fabric.util.addListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.cancelArrow);
}
CreateModeClassic.prototype.disable = function() {
  this.canvas.off("mouse:down", this.onMouseDown);
  fabric.util.removeListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.newPath);
 
}

