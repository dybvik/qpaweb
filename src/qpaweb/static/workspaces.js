
var Workspaces = function() {
  var that = this;
  this.quiver = qpanel.quiver;
  this.panel = qpanel;
  this.modules = {};
  $("#btnAddModule").on("click", function(ev) {
    that.newModule();
  });
}


Workspaces.prototype.buildMenu = function() {
  var that = this;
  var menu = document.getElementById("workspaceMenu");
  var moduleMenu = document.getElementById("modules");
  moduleMenu.innerHTML = "";

  _.each(this.modules, function(value, key) {
    var btnDelete = document.createElement("button");
    btnDelete.style.width = "25px";
    btnDelete.style.height = "25px";
    var icon = document.createElement("i");
    icon.className = "iconClose";
    $(btnDelete).append(icon);
    

    var btnModule = document.createElement("button");
    btnModule.style["width"] = "50%";
    btnModule.appendChild(document.createTextNode(key));
    $(btnModule).on("click", function(event) {
      that.activate(value);
    });
    
    var btnRename = document.createElement("button");
    btnRename.style["width"] = "32%";
    btnRename.appendChild(document.createTextNode("Rename"));
    
    $(moduleMenu).append(btnDelete,btnModule, btnRename);
    
  });
  

}

Workspaces.prototype.newModule = function() {
  var n = 1;
  while(this.modules["Module" + n] != undefined) {n++;}
  var module = new Module(this.quiver);
  this.modules["Module"+n] = module;
  this.buildMenu();
  console.log("mod " + n);
}

Workspaces.prototype.activate = function(item) {
  if(item instanceof Quiver) {
    this.panel.setMode(this.panel.createModeClassic);
  } else if(item instanceof Module) {
    this.panel.moduleMode.module = item;
    this.panel.setMode(this.panel.moduleMode);
  }
}
