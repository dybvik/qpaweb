
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

  $(this).on("vectorspace_change", function(ev, vector) {
    var vsp = vectorSpaces[vector.name];
    _.each(vector.arrows, function(val,key) {
      if(vsp == 0) {
        matrices[val.name] = [];
      }
      else {
        var other = (val.source == this?val.target:val.source);
        if(vectorSpaces[other.name] != 0) {
          matrices[val.name] = Array(vectorSpaces[val.target]);
          for(var i = 0; i < matrices[val.name].length;i++) {
            matrices[val.name][i] = Array(vectorSpaces[val.source]);
            for(var j = 0; j < matrices[val.name][i].length;j++) {
              matrices[val.name][i][j] = 0;
            }
          }
        }
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

Module.prototype.setVectorSpace = function(vector, vectorSpace) {
  var that = this;
  this.vectorSpaces[vector.name] = vectorSpace;
  var vsp = this.vectorSpaces[vector.name] = vectorSpace;
  
  _.each(vector.arrows, function(val,key) {
    if(vsp == 0) {
      that.matrices[val.name] = [];
    }
    else {
      var other = (val.source == this?val.target:val.source);
      if(that.vectorSpaces[other.name] != 0) {
        that.matrices[val.name] = Array(that.vectorSpaces[val.target]);
        for(var i = 0; i < that.matrices[val.name].length;i++) {
          that.matrices[val.name][i] = Array(that.vectorSpaces[val.source]);
          for(var j = 0; j < that.matrices[val.name][i].length;j++) {
            that.matrices[val.name][i][j] = 0;
          }
        }
      }
    }
  });
}

Module.prototype.updateMatrixSize = function(arrow) {
  var other = (val.source == this?arrow.target:arrow.source);
  if(this.vectorSpaces[other.name] != 0) {
    this.matrices[arrow.name] = Array(this.vectorSpaces[arrow.target]);
    for(var i = 0; i < this.matrices[arrow.name].length;i++) {
      this.matrices[arrow.name][i] = Array(this.vectorSpaces[arrow.source]);
      for(var j = 0; j < this.matrices[arrow.name][i].length;j++) {
        this.matrices[arrow.name][i][j] = 0;
      }
    }
  }

}
