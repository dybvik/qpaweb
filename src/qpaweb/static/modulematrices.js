// denne må være på plass innen demoen!
var modules = [];
function newModule() {

}
/**
 * Discarded version of arrow matrices, draws input fields over the canvas. This javascript is not in use.
 * @param quiver Canvas to get Cartesian coordinates for input fields for
 */
function findVertices(quiver) {
    var x1;
    var x2;
    var y1;
    var y2;
    var mpx;
    var mpy;
    var tmp;
    var arrowname;
    var tmpTextArea;

    if (quiver.arrows) {
        _.each(quiver.arrows, function (key, val) {
            arrowname = key.label;

            x1 = key.x1;
            y1 = key.y1;
            x2 = key.x2;
            y2 = key.y2;

            mpx = (x1 + x2) / 2;
            mpy = (y1 + y2) / 2;


            //alert("arrow name: " + arrowname + "\nx1: " + x1 + "\nx2: " + x2 + "\ny1: " + y1 + "\ny2: " + y2 + "\nmpx: " + mpx + "\nmpy:" + mpy);
            tmp = document.createElement("div");
            tmp.id = "mod[0][\"" + arrowname + "\"]";
            tmp.appendChild(document.createTextNode("Matrix for " + arrowname));
            tmp.appendChild(document.createElement("br"));
            tmpTextArea = document.createElement("textarea");
            tmpTextArea.id = "matr[0][\"" + arrowname + "\"]";
            tmp.appendChild(tmpTextArea);

            //alert(JSON.stringify(quiver.arrows));
            document.getElementById("mainbody").appendChild(tmp);
            document.getElementById(tmp.id).style.background = "#000";
            document.getElementById(tmp.id).style.color = "#FFF";
            document.getElementById(tmp.id).style.top = Math.floor(mpy) + "px";
            document.getElementById(tmp.id).style.left = (Math.floor(mpx) + 50) + "px";
            document.getElementById(tmp.id).style.position = "fixed";
            document.getElementById(tmp.id).style.zIndex = 523;
            }
            )}
    else
        {
            alert("No quiver defined!")
        }
    }
/*
 function moduleMatrices() {
 if (quiver)) {
 alert(quiver.get());
 }
 }*/