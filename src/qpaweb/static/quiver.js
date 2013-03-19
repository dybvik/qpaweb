var qcanvas = null;
window.onload = function()
{
  qcanvas = new quiverPanel("qcanvas");
}

/*
* 
*/
function quiverPanel(id)
{
  var canvas = new fabric.Canvas(id);
  this.canvas = canvas;
  canvas.selection = false;
  canvas.hoverCursor = "crosshair";
  var lastVertex = null;
  var that = this;
  
  canvas.on("mouse:down", function(options) {
    
    if(options.target == undefined) {
    
      var pointer = canvas.getPointer(options.e);
      var vertex = new Vertex({
        stroke: "#0000ff",
        fill: "#0000ff",
        top: pointer.y,
        left: pointer.x,
        radius: 6,
        selectable: true});
      //Could have set selectable=false instead of the following
      //attributes, then however, we would not receive any events.
      vertex.lockRotation = true;
      vertex.lockScalingX = true;
      vertex.lockScalingY = true;
      vertex.lockMovementX = true;
      vertex.lockMovementY = true;
      vertex.hasBorders = false;
      vertex.hasControls = false;
      

      canvas.add(vertex);
      
      vertex.arrows = [];
     
      if(lastVertex != null) {
        var arrow = that.newArrow(lastVertex,vertex);
        vertex.arrows.push(arrow);
        lastVertex.arrows.push(arrow);
        
        var o = new Object;
      o.left = canvas.getPointer(options.e).x;
      o.top = canvas.getPointer(options.e).y;
      var a = getVerticesAngle(lastVertex, o);

      }
      lastVertex = vertex;
    }
    else if(options.target.type==="vertex"){
      var arrow = that.newArrow(lastVertex, options.target);
      options.target.arrows.push(arrow);
      lastVertex.arrows.push(arrow);
      getVerticesAngle(lastVertex, options.target);
      lastVertex = options.target;
      
    }
  });
}

quiverPanel.prototype.newArrow = function(source, target) {
  if(source === target) {
    var arrow1 = new LoopArrow({
      top: 0,
      left: 0,
      fill: false,
      stroke: "black",
      scaleY:0.6,
    });
    
    var inc = 0.1;
    var span = 0.7;
    var langle = 0;

    for(i=0;i < target.arrows.length;i++) {
      var arr = target.arrows[i];
      
      if(arr.source === arr.targer) {
        continue;
      }
      var other = (arr.source === source?arr.target:arr.source);
      var angle = getVerticesAngle(other, target);
      if(angle < langle+span && angle> langle-span 
        ||2*Math.PI-angle < langle+span ) {
        console.log((langle*180/Math.PI)+ " discarded");
        langle+=span;
      }else {
        break;
      }
    }
    var rotateGroup = new fabric.Group([arrow1], {
      left: target.left,
      top: target.top,
      angle: 360-((langle)*180/Math.PI),
    });
    console.log((langle*180/Math.PI));
    arrow1.left+=target.radius*4;
    arrow1 = rotateGroup;
    
  }
  else {
    //arrows should start at the edge of vertices. (BTW: top and left attributes are actually x and y of center)
    var len = Math.sqrt(Math.pow(target.left-source.left,2)+Math.pow(target.top-source.top,2));
    var d1 = (target.radius+2)/len;
    var d2 = (source.radius+2)/len;
    var arrow1 = new Arrow([
      source.left+(target.left-source.left)*d2,
      source.top+(target.top-source.top)*d2,
      target.left-(target.left-source.left)*d1,
      target.top-(target.top-source.top)*d1
    ]);
  }
  arrow1.source = source;
  arrow1.target = target;
  arrow1.selectable=false;
  this.canvas.add(arrow1);
  return arrow1;
}

var getVerticesAngle = function(v1,v2) {
  var len = Math.sqrt(Math.pow(v1.left-v2.left,2)+Math.pow(v1.top-v2.top,2));
  var xdiff = (v1.left-v2.left)/len;
  var ydiff = (v1.top-v2.top)/len;
  
  var angle = Math.atan2(ydiff,xdiff);
  if(angle <0) {
    angle = Math.abs(angle);
  }
  else {
    angle = 2* Math.PI - angle;
  }
  console.log("infunc: " + (angle*180/Math.PI));
  return angle;
}


var Vertex = new fabric.util.createClass(fabric.Circle, {
    type: "vertex",
    
    initialize: function(options) {
        this.callSuper("initialize", options);
    }
});



var LoopArrow = new fabric.util.createClass(fabric.Object, {
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
  
  _render: function(ctx) {
    //this.callSuper("_render", ctx);
    
   
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
  }

});

var Arrow = fabric.util.createClass(fabric.Line, {
  type: "arrow",
  
  /*
  * 
  */
  initialize: function(points, options) {
    options || (options = { });
    this.callSuper('initialize', points, options);
  },
  
  
  toObject: function(opts) {
    return fabric.util.object.extend(this.callSuper("toObject", opts));
  },
  
  _render: function(ctx) {
    this.callSuper("_render", ctx);
    
    
    //and now the arrowhead
    
    var angle = Math.atan2(this.height,this.width);
    
    ctx.save();
    
    ctx.translate(this.width/2,this.height/2);
    ctx.rotate(angle-Math.PI/4);

    
    ctx.moveTo(0,0);
    ctx.lineTo(-10,0);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-10);
    ctx.stroke();
    ctx.restore();
  }
});
  
    
















