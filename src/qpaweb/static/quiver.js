var qcanvas;
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
        console.log(options.target);
        console.log(options);
        if(options.target == undefined) {
            console.log(options.e.clientX);
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
            
            if(lastVertex != null)
            {
                
            }
            
            
            canvas.add(vertex);
            
        }
    });
}

var ArrowGfx = fabric.util.createClass(fabric.Line, {
    type: "arrow",
    
    initialize: function(options) {
        options || (options = { });
        this.callSuper("initialize", options);
        
















