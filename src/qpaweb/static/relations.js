var relationPanel = new ( function() {
  rels = [];
  relel = document.getElementById("sidepanel");
  this.addRel = function(rel) {
    rels.push(rel);
    relel.innerHTML += "<br />" +rel;
  }
})();