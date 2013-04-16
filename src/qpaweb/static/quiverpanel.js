var qpanel = null;



window.onload = function () {
    var quiver = new Quiver();
    qpanel = new quiverPanel("qcanvas", quiver);
    document.getElementById("btncreatemode").onclick = function (e) {
        qpanel.setMode(qpanel.createMode);
    }
    document.getElementById("btnjson").onclick = function (e) {
        document.getElementById("debug").value=JSON.stringify(JSON.decycle(quiver), null, 4);
    }

    document.getElementById("btncreatemodeclassic").onclick = function (e) {
        qpanel.setMode(qpanel.createModeClassic);
    }
    qpanel.setMode(qpanel.createModeClassic);

}

/**
 *
 * @constructor
 * @param {String} id The id of the canvas to be drawn on.
 * @param {Quiver} quiver The quiver to be displayed in this panel
 */
function quiverPanel(id, quiver) {
    var that = this;
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

    if (source === target) {
        var arrow1 = new LoopArrowGFX({
            top: 0,
            left: 0,
            fill: false,
            stroke: "black",
        });

        var inc = 0.1;
        var span = Math.PI;
        var langle = 0;

        for (i = 0; i < target.arrows.length; i++) {
            var arr = target.arrows[i];

            if (arr.source === arr.target) {
                continue;
            }
            var other = (arr.source === source ? arr.target : arr.source);
            var angle = getVerticesAngle(other, target);
            if (angle < langle + span && angle > langle - span
                || 2 * Math.PI - angle < langle + span) {
                //console.log((langle*180/Math.PI)+ " discarded");
                langle += span;
            } else {
                break;
            }
        }
        var rotation = 360 - ((langle) * 180 / Math.PI);
        var rotateGroup = new fabric.Group([arrow1], {
            left: target.x,
            top: target.y,
            angle: rotation,
        });

        this.arrows[name] = rotateGroup;
        arrow1.setLabel(name);
        //HACK: offset the rotation
        arrow1._getnumtx().angle = -rotation;
        //console.log((langle*180/Math.PI));
        arrow1.left += this.vertexRadius * 4;
        arrow1 = rotateGroup;


    }
    else {
        //arrows should start at the edge of vertices.
        var len = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
        var d1 = (this.vertexRadius + 2) / len;
        var d2 = (this.vertexRadius + 2) / len;
        var arrow1 = new ArrowGFX([
            source.x + (target.x - source.x) * d2,
            source.y + (target.y - source.y) * d2,
            target.x - (target.x - source.x) * d1,
            target.y - (target.y - source.y) * d1
        ]);
        arrows[name] = arrow1;
        arrow1.setLabel(name);

    }
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
    this.canvas.add(arrow1);
    return arrow1;
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
        //perPixelTargetFind:true,
    }, name);
    vertex.data = data;
    //Could have set selectable=false instead of the following
    //attributes, then however, we would not receive any events.
    vertex.lockRotation = true;
    vertex.lockScalingX = true;
    vertex.lockScalingY = true;
    vertex.lockMovementX = true;
    vertex.lockMovementY = true;
    vertex.hasBorders = false;
    vertex.hasControls = false;


    vertex.arrows = [];
    this.vertices[name] = vertex;
    //|vertex.setLabel(name);
    this.canvas.add(vertex);

    return vertex;
}

quiverPanel.prototype.getCanvas = function () {
    return this.canvas;
}


var getVerticesAngle = function (v1, v2) {
    var len = Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    var xdiff = (v1.x - v2.x) / len;
    var ydiff = (v1.y - v2.y) / len;

    var angle = Math.atan2(ydiff, xdiff);
    if (angle < 0) {
        angle = Math.abs(angle);
    }
    else {
        angle = 2 * Math.PI - angle;
    }
    console.log("infunc: " + (angle * 180 / Math.PI));
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
        this.labeltx = new fabric.Text(label.toString(), {left: 0, top: 0});
        this._calcSize();
    },

    _render: function (ctx) {
        if (this.label != null) {
            this.labeltx._render(ctx);
        }
    }
});


var LoopArrowGFX = new fabric.util.createClass(fabric.Object, {
  type: "loopArrow",

  initialize: function(options) {
    options || (options = { });
    if(!this.width) {this.set('width', 20) }
    if(!this.height) {this.set('height', 20) }
    this.callSuper("initialize", options);
  },

  toObject: function(opts) {
    return fabric.util.object.extend(this.callSuper("toObject", opts));
  },
  setLabel: function(num) {
    this.label = num;

    var top = 0, left = 30;

    this.numtx = new fabric.Text(num.toString(), {left: left, top: top, fontsize: 10});
  },
  _getnumtx: function() { return this.numtx; },
  _render: function(ctx) {
    //this.callSuper("_render", ctx);

    ctx.save();
    ctx.scale(1.0, 0.6);
    ctx.beginPath();
    ctx.arc(0, 0, 17, 1.2*Math.PI, 0.8*Math.PI, false);
    ctx.stroke();
    


    var x = Math.cos(0.8*Math.PI) * 17;
    var y = Math.sin(0.8*Math.PI) * 17;
    ctx.save();


    ctx.translate(x,y+1);
    ctx.rotate(Math.PI*0.9);

    ctx.moveTo(0,0);
    ctx.lineTo(-10,0);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-10);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    if(this.label != null) {
      this.numtx._render(ctx);

    }

});

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
            console.log(this.getWidth() + " " + this.height);
        }
        else if (Math.abs(this.height) < Math.abs(this.width)) {
            top = 10;
        }
        else {
            left = 10
        }
        ;
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
