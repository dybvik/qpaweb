
var CreateModeClassic = function(qc) {
  this.canvas = qc.getCanvas();
  this.panel = qc;
  this.lastVertex = null;
  
}

CreateModeClassic.prototype.enable = function() {
  this.canvas.selection = false;
  var that = this;
  var tt = 0;
  this.cancelArrow = function(e) {
    that.lastVertex = null;
    that.panel.helperArrow.set("visible", false);
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
    var pointer = that.canvas.getPointer(options.e);
    if(options.target == undefined) {
    
      
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
        if(!options.e.shiftKey) {
          that.lastVertex = null;
          that.panel.helperArrow.set("visible", false);
        }else {
           that.lastVertex = vertex;
          that.panel.helperArrow.set({x1: that.lastVertex.x, y1: that.lastVertex.y});
          that.panel.helperArrow.set({x2: pointer.x, y2: pointer.y});
         }

      } 
    }
    else if(options.target.type==="vertex"){
      if(that.lastVertex != null) {
        //var arrow = that.panel.newArrow(that.lastVertex, options.target);
        var arrow = new Arrow(that.panel.arrowNamer.next(),that.lastVertex, options.target.data);
        options.target.data.arrows.push(arrow);
        that.lastVertex.arrows.push(arrow);
        that.panel.quiver.add(arrow);
        
        if(!options.e.shiftKey) {
           that.lastVertex = null;
          that.panel.helperArrow.set("visible", false);
         }else {
           that.lastVertex = options.target.data;
           that.panel.helperArrow.set({x1: that.lastVertex.x, y1: that.lastVertex.y});
           that.panel.helperArrow.set({x2: pointer.x, y2: pointer.y});
         }
    
      } else {
        that.lastVertex = options.target.data;
        that.panel.helperArrow.set({x1: that.lastVertex.x, y1: that.lastVertex.y});
        that.panel.helperArrow.set({x2: pointer.x, y2: pointer.y});
        that.panel.helperArrow.set("visible", true);
      }
    }
  }
  this.panel.helperArrow = new ArrowGFX([0, 0, 1, 1]);
  this.panel.helperArrow.set("visible", false);
  this.panel.helperArrow.set("selectable", false);
  this.canvas.add(this.panel.helperArrow);
  this.canvas.on("mouse:move", function(ev) {
    
    var pointer = that.canvas.getPointer(ev.e);
    if(that.lastVertex != null) {
      
      that.panel.helperArrow.set({x2: pointer.x, y2: pointer.y});
    }
    else {
      
    }
    var d = new Date();
    if(d.getTime()-tt > 20) {
      that.canvas.renderAll(false);
      tt = d.getTime();
    }
    
  });
  this.canvas.on("mouse:down", this.onMouseDown);

  
  //?
  fabric.util.addListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.cancelArrow);
}
CreateModeClassic.prototype.disable = function() {
  this.canvas.off("mouse:down", this.onMouseDown);
  fabric.util.removeListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", this.newPath);
  
}

