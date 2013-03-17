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
  
  canvas.on("mouse:down", function(options) {

    if(options.target == undefined) {

      var vertex = new fabric.Circle({
        stroke: "#0000ff",
        fill: "#0000ff",
        top: options.e.clientY,
        left: options.e.clientX,
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
      
      
      if(lastVertex != null) {
        console.log(options.e.clientX + " - " + vertex.left + " - " + lastVertex.left);
        console.log("adding new arrow");
		//arrows should start at the edge of vertices. (BTW: top and left attributes are actually x and y of center)
		var len = Math.sqrt(Math.pow(vertex.left-lastVertex.left,2)+Math.pow(vertex.top-lastVertex.top,2));
	    var d1 = vertex.radius/len;
		var d2 = lastVertex.radius/len;
        var arrow1 = new Arrow([lastVertex.left+
		  (vertex.left-lastVertex.left)*d2,lastVertex.top+(vertex.top-lastVertex.top)*d2,
          vertex.left-(vertex.left-lastVertex.left)*d1,vertex.top-
		  (vertex.top-lastVertex.top)*d1]);
        arrow1.selectable=false;
        canvas.add(arrow1);
      }
      lastVertex = vertex;
       
      
      
    }
    
  });
}

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
  
    
















