
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
  });
}
