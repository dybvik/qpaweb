/**
 * @classdesc When this mode is enabled labels are replaced with vectorspaces and matrices.
 * @constructor
 */
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
    arrow.selectable=true;
    arrow.perPixelTargetFind = true;
  });

  this.onMouseDown = function(event) {
    console.log("msoda");
    if(event.target.type == "vertex") {
      GetInput("Set vertexspace", event.target.left, event.target.top, function(value) {
        that.module.setVectorSpace(event.target.data, parseInt(value));
      });
    } else if(event.target.data instanceof Arrow && that.module.matrices[event.target.data.name].length > 0 && that.module.matrices[event.target.data.name][0].length > 0) {
      GetMatrix("Set matrix", event.target.left,event.target.top, that.module.matrices[event.target.data.name], 
               function(newmatrix) {
                 console.log("o" + newmatrix);
                 that.module.setMatrix(event.target.data,newmatrix);
               });
    }
  }
  this.onVectorSpaceChange = function(event, vertex, vectorSpace) {
    that.panel.vertices[vertex.name].setLabel(vectorSpace);
  }

  this.onMatrixChange = function(event, arrow, matrix) {
    that.panel.arrows[arrow.name].setLabel(new MatrixGF(matrix));
  }
  $(this.module).on("vectorspace_change.modulemode", this.onVectorSpaceChange);
  this.canvas.on("mouse:down", this.onMouseDown);
  $(this.module).on("matrix_change,modulemode", this.onMatrixChange);
  
  that.canvas.renderAll();
}

ModuleMode.prototype.disable = function() {
  _.each(this.panel.vertices, function(vertex) {
    vertex.setLabel(vertex.data.name);
  });
  _.each(this.panel.arrows, function(arrow) {
    arrow.setLabel(arrow.data.name);
  });
  this.canvas.off("mouse:down", this.onMouseDown);
  $(this.module).off("vectorspace_change.modulemode");
  $(this.module).off("matrix_change.modulemode");
}
