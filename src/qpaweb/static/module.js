

/**
 * Creates and instance of Module
 * @classdesc A module of a quiver, containing vectorspaces for all vertices and matrices for all arrows.
 * @constructor
 * @param {Quiver} quiver
 */
var Module = function(quiver) {
  var that = this;
  this.quiver = quiver;
  var vectorSpaces = {};
  var matrices = {};
  _.each(quiver.items, function(item,key,list) {
    console.log(item.name);
    if(item instanceof Vertex) {
      vectorSpaces[item.name] = 0;
    } else if(item instanceof Arrow) {
      matrices[item.name] = [];
    }
    
  });

  $(this).on("vectorspace_change", function(ev, vertex) {
    var vsp = vectorSpaces[vertex.name];
    _.each(vertex.arrows, function(arrow,key) {
      if(vsp == 0) {
        matrices[arrow.name] = [];
      }
      else {
        that.updateMatrixSize(arrow);
      }
    });
  });

  $(quiver).on("add_item", function(event, item) {
    if(item instanceof Vertex) {
      vectorSpaces[item.name] = 0;
    } else if(item instanceof Arrow) {
      matrices[item.name] = [];
      that.updateMatrixSize(item);
    }
  });

  this.vectorSpaces = vectorSpaces;
  this.matrices = matrices;
  
}

/**
 * Change the vectorspace of a vertex.
 * Will automatically update the size of matrices of any arrows connected to the vertex
 * @param {Vertex} vertex
 * @param {int} vectorSpace
 */
Module.prototype.setVectorSpace = function(vertex, vectorSpace) {
  var that = this;
  this.vectorSpaces[vertex.name] = vectorSpace;
  var vsp = this.vectorSpaces[vertex.name] = vectorSpace;
  
  _.each(vertex.arrows, function(arrow,key) {
    that.updateMatrixSize(arrow);
  });
  $(this).trigger("vectorspace_change", [vertex, vectorSpace]);
  
}

/**
 * Updates the matrix of an array in this modules quiver.
 * Will accept matrices of incorrect sizes.
 * All array elements must be numbers.
 * @param {Arrow} arrow
 * @oaram matrix A two-dimensional array representing the matrix to set
 */
Module.prototype.setMatrix = function(arrow, matrix) {
  this.matrices[arrow.name]=matrix;
  $(this).trigger("matrix_change", [arrow, matrix]);
}

/**
 * Recalculates the size of an arrows matrix based on the vectorSpaces of the arrows source and target.
 * Note: Any data currently residing in the matrix before a call to this method will be lost.
 * @param {Arrow} The arrows whose matrix to update
 */
Module.prototype.updateMatrixSize = function(arrow) {

  this.matrices[arrow.name] = Array(this.vectorSpaces[arrow.source.name]);
  for(var i = 0; i < this.matrices[arrow.name].length;i++) {
    this.matrices[arrow.name][i] = Array(this.vectorSpaces[arrow.target.name]);
    for(var j = 0; j < this.matrices[arrow.name][i].length;j++) {
      this.matrices[arrow.name][i][j] = 0;
    }
    
  }
  $(this).trigger("matrix_change", [arrow, this.matrices[arrow.name]]);

}
