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
                var arrow1 = new Arrow([lastVertex.left,lastVertex.top,
                    vertex.left,vertex.top]);
                arrow1.selectable=false;
                canvas.add(arrow1);
            }
            lastVertex = vertex;
            
            
            
        }
        
    });
}

var Arrow = fabric.util.createClass(fabric.Object, {
    type: "arrow",
    
    initialize: function(points, options) {
        options || (options = { });
        this.callSuper('initialize', options);

        this.set('x1', points[0]);
        this.set('y1', points[1]);
        this.set('x2', points[2]);
        this.set('y2', points[3]);
        
        console.log("ARROW INIT");
        this._setWidthHeight(options);
        this.line = new fabric.Line([-this.width/2,-this.height/2,this.width/2, this.height/2], options);
    },
    _setWidthHeight: function(options) {
      options || (options = { });

      this.set('width', (this.x2 - this.x1) || 1);
      this.set('height', (this.y2 - this.y1) || 1);

      this.set('left', 'left' in options ? options.left : (this.x1 + this.width / 2));
      this.set('top', 'top' in options ? options.top : (this.y1 + this.height / 2));
    },
    
    toObject: function(opts) {
        return fabric.util.object.extend(this.callSuper("toObject", opts));
    },
    
    _render: function(ctx) {
        console.log("rendering arrow");
        this.line.render(ctx);
    }
});
    
        
















