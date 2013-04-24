var qpanel = null;



window.onload = function () {
    var quiver = new Quiver();
    qpanel = new quiverPanel("qcanvas", quiver);
    /*document.getElementById("btncreatemode").onclick = function (e) {
        qpanel.setMode(qpanel.createMode);
    }*/
  document.getElementById("btnjson").onclick = function (e) {

    var jsn = JSON.stringify(quiver, function(key, val) {
      var o = null;
      if(val instanceof Vertex) {
        o = {};
        o.x = val.x;
        o.y = val.y;
        o.type = "vertex";
      }
      else if(val instanceof Arrow) {
        o = {};
        o.source = val.source.name;
        o.target = val.target.name;
        o.type = "arrow";
      } else { return val; }
      return o;
    },2);
    document.getElementById("debug").value=jsn;
  }

  /*document.getElementById("btncreatemodeclassic").onclick = function (e) {
        qpanel.setMode(qpanel.createModeClassic);
    }*/
    qpanel.setMode(qpanel.createModeClassic);
  
  var relin = document.getElementById("relation");
  var relp = new RelationPanel(qpanel, null, relin);
}

/**
 *
 * @constructor
 * @param {String} id The id of the canvas to be drawn on.
 * @param {Quiver} quiver The quiver to be displayed in this panel
 */
function quiverPanel(id, quiver) {
  var that = this;
  this.moving = false;
  var canvas = new fabric.Canvas(id, {targetFindTolerance: 10, });
  this.canvas = canvas;
  
  this.createMode = new CreateQuiverMode(this);
  this.createModeClassic = new CreateModeClassic(this);
  
  this.vertexNamer = new NumberNameGenerator(quiver);
  this.arrowNamer = new AlfabetNameGenerator(quiver);
  this.quiver = quiver;
  canvas.hoverCursor = "crosshair";
  
  this.vertices = {};
  this.arrows = {};
  this.angler = new fabric.Text("", {top:50, left:50});
  canvas.add(this.angler);

    //styling:
    this.vertexRadius = 10;


    this.loadQuiver(); 
   $(this.quiver).on("add_item.quiverpanel", function (ev, item) {
        if (item instanceof Vertex) {
            var v = that.newVertex(item);
            v.arrows = [];
        }
        else if (item instanceof Arrow) {
            that.newArrow(item);
        }
        $(item).on("change_name.quiverpanel", function (ev, oldname) {
            if (item instanceof Vertex) {
                that.vertices[oldname].setLabel(item.name);
            }
            else if (item instanceof Arrow) {
                that.arrows[oldname].setLabel(item.name);
            }
        });
    });
    $(this.quiver).on("remove_item.quiverpanel", function (ev, item) {
        if (item instanceof Vertex) {
            that.canvas.remove(that.vertices[item.name]);
            delete that.vertices[item.name];
        }
        else if (item instanceof Arrow) {
            that.canvas.remove(that.arrows[item.name]);
            delete that.arrows[item.name];
        }
    });


}

quiverPanel.prototype.loadQuiver = function () {
    if (this.currentMode) {
        this.currentMode.disable();
    }
    this.canvas.clear();
    arrows = [];
    for (item in this.quiver.items) {
        if (item instanceof Vertex) {
            var v = this.newVertex(item);
            v.arrows = [];
        } else if (item instanceof Arrow) {
            arrows.push(item);
        }
    }
    arrows.forEach(function (arrow) {
        arrow = this.newArrow(arrow.source, arrow.target);
    });
    if (this.currentMode) {
        this.currentMode.enable();
    }
}

quiverPanel.prototype.setMode = function (mode) {
  if (this.currentMode) {
    this.currentMode.disable()
  }
  this.currentMode = mode;
  this.currentMode.enable();
}

quiverPanel.prototype.newArrow = function (data) {
  var name = data.name, source = data.source, target = data.target;

  var inc = 0.1;
  var span = Math.PI/8;
  var langle = 0;

  var sarrows = {};

  for(i = 0;i < target.arrows.length;i++) {
    
  }

  if (source === target) {
    
    for (i = 0; i < target.arrows.length; i++) {
      var arr = target.arrows[i];

      if(arr.source === arr.target) {
        continue;
      }
      
      var other = (arr.source === source ? arr.target : arr.source);
      var angle = getVerticesAngle(target, other);
      if (angle < langle + span && angle > langle - span
          || 2 * Math.PI - angle < langle + span) {
        langle += span;
      } else {
        break;
      }
    }
    var rotation = 2*Math.PI - langle;//((langle) * 180 / Math.PI);
    var vgfx =  this.vertices[target.name];
    var offset = (vgfx.width > vgfx.height?vgfx.width:vgfx.height);
    var arrow1 = new LoopArrowGFX({
      top: target.y,
      left: target.x,
      fill: false,
      stroke: "black",
      angle: rotation,
      offset: offset/2+10,
    });
    

    arrow1.setLabel(name);
  }
  else {
    //arrows should start at the edge of vertices.
    var len = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
    

    var d1, d2;
    var coords = this.generateArrowCoords(source, target);
    
//    console.log(d1 + ", " + d2);
    var arrow1 = new ArrowGFX([
      coords[0],
      coords[1],
      coords[2],
      coords[3],
    ]);
   
    arrow1.setLabel(name);

  }
  this.arrows[name] = arrow1;
  arrow1.lockRotation = true;
  arrow1.lockScalingX = true;
  arrow1.lockScalingY = true;
  arrow1.lockMovementX = true;
  arrow1.lockMovementY = true;
  arrow1.hasBorders = false;
  arrow1.hasControls = false;
  arrow1.perPixelTargetFind = true;
  arrow1.source = source;
  arrow1.target = target;

  //arrow1.selectable=false;
  arrow1.data = data;

  this.vertices[arrow1.source.name].addArrow(arrow1);
  this.vertices[arrow1.target.name].addArrow(arrow1);
  this.canvas.add(arrow1);
  return arrow1;
}

quiverPanel.prototype.generateArrowCoords = function(source, target) {
  if(source == target) {
    return null;
  }
  var sx = 0, sy = 0, tx, ty;
  var t1 = this.vertices[source.name].width > this.vertices[source.name].height == Math.abs(target.x-source.x) > Math.abs(target.y-source.y);
  var t2 = Math.abs(target.x-source.x) > Math.abs(target.y-source.y);
  if(t1 && t2 || !t1 && t2) {
    sy = source.y + (this.vertices[source.name].width*0.5*(target.y-source.y))/Math.abs(target.x-source.x);
    sx = source.x + (target.x>source.x?1:-1)*this.vertices[source.name].width/2;
  } else if(!t1 && !t2 || t1 && !t2){
    sx = source.x + (this.vertices[source.name].height*0.5*(target.x-source.x))/Math.abs(target.y-source.y);
    sy = source.y + (target.y>source.y?1:-1)*this.vertices[source.name].height/3;
  }
  var t1 = this.vertices[target.name].width > this.vertices[target.name].height == Math.abs(target.x-source.x) > Math.abs(target.y-source.y);
  var t2 = Math.abs(target.x-source.x) > Math.abs(target.y-source.y);
  if(t1 && t2 || !t1 && t2) {
    ty = target.y - (this.vertices[target.name].width*0.5*(target.y-source.y))/Math.abs(target.x-source.x);
    tx = target.x - (target.x>source.x?1:-1)*this.vertices[target.name].width/2;
  } else if(!t1 && !t2 || t1 && !t2){
    tx = target.x - (this.vertices[target.name].height*0.5*(target.x-source.x))/Math.abs(target.y-source.y);
    ty = target.y - (target.y>source.y?1:-1)*this.vertices[target.name].height/3;
  }

  return [sx, sy, tx, ty];

}

quiverPanel.prototype.newVertex = function (data) {
  var x = data.x, y = data.y, name = data.name;
  var vertex = new VertexGFX({
    stroke: "#0000ff",
    fill: "none",
    top: y,
    left: x,
    radius: this.vertexRadius,
    selectable: true,
    hasBorders: true,
    //perPixelTargetFind:true,
  }, name);
  vertex.data = data;
  //Could have set selectable=false instead of the following
  //attributes, then however, we would not receive any events.
  vertex.lockRotation = true;
  vertex.lockScalingX = true;
  vertex.lockScalingY = true;
  //vertex.lockMovementX = true;
  //vertex.lockMovementY = true;
  vertex.hasBorders = false;
  vertex.hasControls = false;
  
  var that = this;

  vertex.arrows = [];
  this.vertices[name] = vertex;

  vertex.on("moving", function(ev) {
    that.moving = true;
    var source, target;
    vertex.data.x = vertex.left;
    vertex.data.y = vertex.top;
    _.each(vertex.data.arrows, function(val, key, list) {
      if(val.source == val.target) { 
        that.arrows[val.name].set({left: vertex.data.x, top:vertex.data.y,});
        return; }
      var coords = that.generateArrowCoords(val.source, val.target);
      that.arrows[val.name].set({x1:coords[0], y1: coords[1], x2: coords[2], y2: coords[3]});
    });
   vertex.on("modified", function(ev) {
     that.createModeClassic.lastVertex = null;
     that.moving = false;
   });
    
  });
  //|vertex.setLabel(name);
  this.canvas.add(vertex);

  return vertex;
}

quiverPanel.prototype.getCanvas = function () {
  return this.canvas;
}


var getVerticesAngle = function (v1, v2) {
  var len = Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
  var xdiff = (v2.x - v1.x) / len;
  var ydiff = (v2.y - v1.y) / len;

  var angle = Math.atan2(ydiff, xdiff);
  if (angle < 0) {
    angle = Math.abs(angle);
  }
  else {
    angle = 2 * Math.PI - angle;
  }
  return angle;
}


var VertexGFX = new fabric.util.createClass(fabric.Object, {
  type: "vertex",

  initialize: function (options, label) {
    options || (options = { });
    this.callSuper("initialize", options);
    this.setLabel(label);
  },
  _calcSize: function () {
    if (this.label != null) {
      this.set("width", this.labeltx.get("width"));
      this.set("height", this.labeltx.get("height"));
      this.setCoords();
    }
  },

  setLabel: function (label) {
    this.label = label;
    this.labeltx = new fabric.Text(label.toString(), {left: 0, top: 0, hasBorders: true, borderColor: "black"});
    this._calcSize();
  },

  _render: function (ctx) {
    if (this.label != null) {
      this.labeltx._render(ctx);
    }
  },
  addArrow: function(arrow) {
    var i = 0, angle, other, angle2;
    if(arrow.source == arrow.target) { return; }
    for(i=0;i<this.arrows.length;i++) {
      if(this.arrows[i].data.source == this.data) {
        other = this.arrows[i].data.target;
        angle = getVerticesAngle(this.data, other);
      } else {
        other = this.arrows[i].data.source;
        angle = getVerticesAngle(other, this.data);
      }
      if(arrow.source == this.data) {
        other = arrow.target;
        angle2 = getVerticesAngle(this.data, other);
      } else {
        other = arrow.source;
        angle2 = getVerticesAngle(other, this.data);
      }
      if(angle2 > angle) {
        this.arrows.splice(i, 0, arrow);
        return;
      }
    }
    this.arrows.push(arrow);

  }
});


var LoopArrowGFX = new fabric.util.createClass(fabric.Object, {
  type: "loopArrow",

  initialize: function(options) {
    options || (options = { });
    if(!this.width) {this.set('width', 20) }
    if(!this.height) {this.set('height', 20) }
    this.set("offset", options.offset);

    this.callSuper("initialize", options);
  },

  toObject: function(opts) {
    return fabric.util.object.extend(this.callSuper("toObject", opts));
  },
  setLabel: function(num) {
    this.label = num;

    var top = 0;

    this.numtx = new fabric.Text(num.toString(), {left: 0, top: top, fontsize: 10});
  },
  _getnumtx: function() { return this.numtx; },
  _render: function(ctx) {

    ctx.save();
    ctx.rotate(this.get("angle"));

    ctx.save();
    ctx.scale(1.0, 0.6);
    ctx.beginPath();
    ctx.arc(this.get("offset"), 0, 17, 1.2*Math.PI, 0.8*Math.PI, false);
    ctx.stroke();
    


    var x = this.get("offset") + Math.cos(0.8*Math.PI) * 17;
    var y = Math.sin(0.8*Math.PI) * 17;



    ctx.translate(x,y+1);
    ctx.rotate(Math.PI*0.9);


    ctx.moveTo(0,0);
    ctx.lineTo(-10,0);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-10);
    ctx.stroke();


    ctx.restore();
    if(this.label != null) {
      ctx.save();
      ctx.translate(this.get("offset")+17*2, 0);
      ctx.rotate(-this.get("angle"));
      this.numtx._render(ctx);
      ctx.restore();
    }
    ctx.restore();

}});

var ArrowGFX = fabric.util.createClass(fabric.Line, {
    type: "arrow",

    /*
     *
     */
    initialize: function (points, options) {
        options || (options = { });
        this.callSuper('initialize', points, options);
    },


    toObject: function (opts) {
        return fabric.util.object.extend(this.callSuper("toObject", opts));
    },
    setLabel: function (num) {
        this.label = num;

        var top = 0, left = 0;
        if (Math.max(Math.abs(this.height),
            Math.abs(this.width)) / Math.min(Math.abs(this.height), Math.abs(this.width)) < 1.4) {
            //top=15;
            left = 15;
        }
        else if (Math.abs(this.height) < Math.abs(this.width)) {
            top = 10;
        }
        else {
            left = 10;
        }

        this.numtx = new fabric.Text(num.toString(), {left: left, top: top, fontsize: 10});
    },

    _render: function (ctx) {
        this.callSuper("_render", ctx);


        //and now the arrowhead

        var angle = Math.atan2(this.height, this.width);

        ctx.save();

        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(angle - Math.PI / 4);


        ctx.moveTo(0, 0);
        ctx.lineTo(-10, 0);
        ctx.stroke();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -10);
        ctx.stroke();
        ctx.restore();
        if (this.label != null) {
            this.numtx._render(ctx);
        }
    }
});
