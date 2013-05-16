
var RelationPanel = function(qpanel, relPanelEl, relInputEl) {
  this.qpanel = qpanel;
  this.el = relPanelEl;
  this.input = relInputEl;
  this.input.value="";
  
  this.trel = null;
  this.list = new RelationList();

  var that = this;


  $(this.input).on("input", function(ev) {
    that.trel = new Relation(ev.target.value, qpanel.quiver);
    if(that.trel.valid) {
      ev.target.style.color = "black";
    } else {
      ev.target.style.color = "red";
    }
    that.highlight(that.trel);
  });
  $("#btnrels").on("click", function(ev) {
    if(that.trel.valid) {
      that.list.add(that.trel);
      $("#dataMenu ul").append("<li>"+that.trel.relstring+"</li>");
      console.log(that.trel.relstring);
    }
  });
}

RelationPanel.prototype.highlight= function(rel) {
  var i=0,j=0;
  var tarrow = null;
  _.each(this.qpanel.arrows, function(val, key, list) {
    val.set("stroke", "black");
  });

  if(rel.rel != undefined) {
  
    
    for(i=0;i<rel.rel.length;i++) {
      if(rel.rel[i] == null || typeof rel.rel[i] == "string") {
        continue;
      }
      for(j=0;j<rel.rel[i].length;j++) {
      if(rel.rel[i][j] instanceof Array) {
        tarrow = rel.rel[i][j][0];
      }else { tarrow = rel.rel[i][j];}
        if(tarrow != undefined && (tarrow instanceof Arrow)) {
          this.qpanel.arrows[tarrow.name].set("stroke", "blue");
          
        }
      }
    }
  }
  this.qpanel.canvas.renderAll();
}
