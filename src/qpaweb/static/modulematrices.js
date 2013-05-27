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

var GetInput = function(title, x,y, callback) {
  var tmp = document.createElement("div");

  tmp.appendChild(document.createTextNode(title));
  tmp.appendChild(document.createElement("br"));
  var tmpTextArea = document.createElement("input");
  tmpTextArea.type="text";
  //tmpTextArea.id = "matr[0][\"" + arrowname + "\"]";
  tmp.appendChild(tmpTextArea);
  var tmpBtnOk = document.createElement("button");
  tmpBtnOk.value="OK";
  $(tmpBtnOk).on("click", function(event) {
    callback($(tmpTextArea).val());
    $(tmp).remove();
  });
  $(tmpBtnOk).append("OK");
  tmp.appendChild(tmpBtnOk);
  $("#mainbody").append(tmp);
  tmp.style.background = "#000";
  tmp.style.color = "#FFF";

  tmp.style.top =  Math.floor(y) + "px";
  tmp.style.left = (Math.floor(x)) + "px";
  tmp.style.position = "fixed";
  tmp.style.zIndex = 523;//523?
}

var GetMatrix = function(title,x,y,matrix,callback) {

  var tmp = document.createElement("div");
  var i=0,j=0;
  var input = null;
  tmp.appendChild(document.createTextNode(title));
  tmp.appendChild(document.createElement("br"));
  var inputMatrix = Array(matrix.length);
  for(i = 0;i < matrix.length;i++) {
    inputMatrix[i] = Array(matrix[i].length);
    for(j = 0; j < matrix[i].length;j++) {
      input = document.createElement("input");
      input.type = "text";
      input.size = "4";
      input.value = matrix[i][j].toString();
      $(tmp).append(input);
      input.style.display = "inline-block";
      inputMatrix[i][j]=input;
    }
    $(tmp).append(document.createElement("br"));
  }
  btnOk = document.createElement("button");
  btnOk.value = "OK";
  btnOk.appendChild(document.createTextNode("OK"));
  $(btnOk).on("click", function(ev) {
    var newmatrix = Array(matrix.length);
    for(i = 0;i < matrix.length;i++) {
      newmatrix[i] = Array(matrix[i].length);
      for(j = 0;j < matrix[i].length;j++) {
        newmatrix[i][j] = parseInt(inputMatrix[i][j].value);
      }
    }
   
    callback(newmatrix);
     $(tmp).remove();
  });
  $(tmp).append(btnOk);
  $("#mainbody").append(tmp);
  tmp.style.background = "#000";
  tmp.style.color = "#FFF";
  tmp.style.overflow = "scroll";
  tmp.style["box-sizing"] = "border-box";
  tmp.style["max-width"]="200px";
  tmp.style.display = "inline-block";
  tmp.style["white-space"] = "nowrap";
  tmp.style.top =  Math.floor(y) + "px";
  tmp.style.left = (Math.floor(x)) + "px";
  tmp.style.position = "fixed";
  tmp.style.zIndex = 523;//523?
}
